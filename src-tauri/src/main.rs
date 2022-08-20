#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod data;
use crate::data::{
    LaunchResult,
    LaunchResultError,
};
use tauri::Manager;
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use log::*;
use playhub_client::{proxy_client::run, ActiveStreams, error::Error};
use tokio_util::sync::CancellationToken;

lazy_static::lazy_static! {
    pub static ref ACTIVE_STREAMS: ActiveStreams = Arc::new(RwLock::new(HashMap::new()));
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

fn main() {
    pretty_env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // long_running_command,
            launch_tunnel,
            // launch_local_server
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
