#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod data;
use crate::data::{
    LaunchResult,
    LaunchResultError,
    // LaunchLocalResult,
    LaunchLocalResultError,
    LocalMessage,
};
use tauri::Manager;
use tokio::time::{sleep, Duration};
use tokio::sync::mpsc;
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use log::*;
use playhub_client::{proxy_client::run, ActiveStreams, error::Error};
use tokio_util::sync::CancellationToken;
use std::process::Stdio;
use tokio::process::{Command, Child};
use tokio_util::codec::{FramedRead, LinesCodec};
use futures::prelude::*;

lazy_static::lazy_static! {
    pub static ref ACTIVE_STREAMS: ActiveStreams = Arc::new(RwLock::new(HashMap::new()));
}

#[tauri::command]
async fn long_running_command(window: tauri::Window) -> String {
    println!("long_running_command invoked");

    let (tx, mut rx) = mpsc::unbounded_channel();
    let unlisten = window.once("cancel_command", move |event| {
        if let Err(e) = tx.send(()) {
        // command が正常終了したあともこのクロージャで event を listen しつづける
        // rx が drop される
        // -> SendError
        println!("failed to send value {:?}", e);
        }
    });

    let sleep = sleep(Duration::from_secs(10));
    tokio::pin!(sleep);

    let msg = tokio::select! {
        _ = rx.recv() => {
            println!("command was cancelled");
            "command was cancelled".to_string()
        }
        _ = sleep => {
            println!("sleep over");
            "command finished successfully".to_string()
        }
    };

    window.unlisten(unlisten);
    println!("long_running_command finished execution");
    msg
}

#[tauri::command]
async fn launch_tunnel(window: tauri::Window, token_server: String, local_port: u16) -> LaunchResult {
    let cancellation_token = CancellationToken::new();
    let ct = cancellation_token.clone();
    let unlisten = window.once("interrupt_launch_tunnel", move |event| {
        ct.cancel();
    });


    let control_port: u16 = 5000;
    // let local_port: u16 = 12000;
    // let token_server = "http://localhost:8123/v0/request_token";

    let (client_info, handle) =
        match run(&ACTIVE_STREAMS, control_port, local_port, &token_server, cancellation_token).await {
            Ok(r) => r,
            Err(e) => {
            window.unlisten(unlisten);
            return Err(LaunchResultError::LaunchFailed(e.to_string()));
            }
        };
    info!("client is running under configuration: {:?}", client_info);
    let _ = window.emit_all("update_client_info", client_info);

    let v = handle.await;
    window.unlisten(unlisten);

    match v {
        Err(e) => {
            error!("join error {:?} for client", e);
            Err(LaunchResultError::InternalClientError(e.to_string()))
        }
        Ok(Err(Error::JoinError(e))) => {
            error!("internal join error {:?} for client", e);
            Err(LaunchResultError::InternalClientError(e.to_string()))
        }
        Ok(Err(e)) => {
            error!("client exited. reason: {:?}", e);
            Err(LaunchResultError::ClientExited(e.to_string()))
        }
        Ok(Ok(_)) => {
            info!("client successfully terminated");
            Ok(())
        }
    }
}

#[cfg(target_os = "windows")]
fn spawn_command(command: String) -> Result<Child, LaunchLocalResultError> {
    let child = Command::new("cmd")
        .kill_on_drop(true)
        .arg("/c")
        .arg(command)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| LaunchLocalResultError::SpawnFailed(e.to_string()))?;
    Ok(child)
}

#[cfg(not(target_os = "windows"))]
fn spawn_command(command: String) -> Result<Child, LaunchLocalResultError> {
    let child = Command::new("sh")
        .kill_on_drop(true)
        .arg("-c")
        .arg(command)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| LaunchLocalResultError::SpawnFailed(e.to_string()))?;
    Ok(child)
}

#[tauri::command]
async fn launch_local_server(window: tauri::Window, command: String) -> Result<(), LaunchLocalResultError> {
    let cancellation_token = CancellationToken::new();
    let ct = cancellation_token.clone();
    let unlisten = window.once("interrupt_launch_local_server", move |event| {
        ct.cancel();
    });

    let mut child = spawn_command(command)?;
    let stdout = match child.stdout.take() {
        Some(stdout) => stdout,
        None => {
            return Err(LaunchLocalResultError::NoStdout);
        }
    };
    let stderr = match child.stderr.take() {
        Some(stderr) => stderr,
        None => {
            return Err(LaunchLocalResultError::NoStderr);
        }
    };
    let mut stdout_reader = FramedRead::new(stdout, LinesCodec::new());
    let mut stderr_reader = FramedRead::new(stderr, LinesCodec::new());

    let ct = cancellation_token.clone();

    let read_stream = async {
        loop {
            tokio::select! {
                Some(line) = stdout_reader.next() => {
                    let line = line.map_err(|e| LaunchLocalResultError::LineCorrupted(e.to_string()))?;
                    println!("{}", line);

                    let payload = LocalMessage {
                        message: line
                    };
                    let _ = window.emit_all("local_server_message", payload);
                }
                Some(line) = stderr_reader.next() => {
                    let line = line.map_err(|e| LaunchLocalResultError::LineCorrupted(e.to_string()))?;
                    println!("{}", line);

                    let payload = LocalMessage {
                        message: line
                    };
                    let _ = window.emit_all("local_server_message", payload);
                }
                else => break
            }
        }
        Ok::<(), LaunchLocalResultError>(())
    };

    tokio::select! {
        result = read_stream => {
            if let Err(e) = result {
                return Err(e);
            }
        }
        _ = ct.cancelled() => {
            window.unlisten(unlisten);
            return Ok(());
        }
    }

    tokio::select! {
        status = child.wait() => {
            window.unlisten(unlisten);

            let status = status.map_err(|_| LaunchLocalResultError::WaitFailed)?;
            if !status.success() {
                return Err(LaunchLocalResultError::StatusCodeError);
            }
        }
        _ = ct.cancelled() => {
            window.unlisten(unlisten);
            return Ok(())
        }
    }

    Ok(())
}

fn main() {
    pretty_env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            long_running_command,
            launch_tunnel,
            launch_local_server
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
