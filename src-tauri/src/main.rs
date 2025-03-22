#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod data;
use std::path::Path;

use crate::data::{
    LaunchResult,
    LaunchResultError,
};
use data::CreateEulaError;
use tauri::Manager;
use log::*;
use ownserver::{error::Error, proxy_client::{run_client, RequestType}};
use ownserver_lib::{EndpointClaim, EndpointClaims, Protocol};
use tokio::{fs, task::JoinSet};
use tokio_util::sync::CancellationToken;

const EULA_CONTENT: &str = r#"
#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
eula=true
"#;

async fn collect_join_set(mut set: JoinSet<Result<(), Error>>) -> Result<(), LaunchResultError> {
    while let Some(res) = set.join_next().await {
        match res {
            Err(e) => {
                error!("join error {:?} for client", e);
                return Err(LaunchResultError::InternalClientError{ message: e.to_string()})
            }
            Ok(Err(e)) => {
                error!("client exited. reason: {:?}", e);
                return Err(LaunchResultError::ClientExited{ message: e.to_string()})
            }
            Ok(Ok(_)) => {
                info!("client successfully terminated");
            }
        }
    }
    Ok(())
}


#[tauri::command]
async fn launch_tunnel(window: tauri::Window, token_server: String, endpoint_claims: EndpointClaims) -> LaunchResult {
    let cancellation_token = CancellationToken::new();
    let ct = cancellation_token.clone();
    let unlisten = window.once("interrupt_launch_tunnel", move |event| {
        ct.cancel();
    });

    // let payload = match payload.as_str() {
    //     "udp" => Payload::UDP,
    //     _ => Payload::Other,
    // };
    let store = Default::default();
    let control_port: u16 = 5000;

    let config = Box::leak(Box::new(ownserver::Config {
        control_port,
        token_server,
        ping_interval: 15,
    }));

    let request = RequestType::NewClient {
        endpoint_claims
    };
    match run_client(config, store, cancellation_token, request).await {
        Ok(r) => r,
        Err(e) => {
            window.unlisten(unlisten);
            return Err(LaunchResultError::LaunchFailed{ message: e.to_string() });
        }
    }

    // info!("client is running under configuration: {:?}", client_info);
    // let _ = window.emit_all("update_client_info", client_info);

    window.unlisten(unlisten);

    Ok(())

}

#[tauri::command]
async fn create_eula(basedir: String) -> Result<(), CreateEulaError> {
    let base = Path::new(&basedir);
    if !base.exists() {
        return Err(CreateEulaError::IoError { message: "basedir does not exist".into() });
    }

    let path = base.join("eula.txt");
    fs::write(path, EULA_CONTENT).await
        .map_err(|e| {
            CreateEulaError::IoError { message: format!("failed to create eula.txt {}", e) }
        })
}

fn main() {
    pretty_env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            launch_tunnel,
            create_eula,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
