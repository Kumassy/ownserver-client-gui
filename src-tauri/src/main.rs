#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod data;
use std::{path::Path, sync::Arc};
use std::time::Duration;
use tauri::Manager;
use tokio::time::sleep;

use crate::data::{
    LaunchResult,
    LaunchResultError,
};
use data::CreateEulaError;
use ownserver::{proxy_client::{run_client, RequestType}, Store};
use ownserver_lib::EndpointClaims;
use tokio::fs;
use tokio_util::sync::CancellationToken;
use log::info;

const EULA_CONTENT: &str = r#"
#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
eula=true
"#;

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
    let store = Arc::new(Store::default());

    let window_ = window.clone();
    let store_ = store.clone();
    let ct = cancellation_token.clone();
    tokio::spawn(async move {
        loop {
            tokio::select! {
                _ = sleep(Duration::from_secs(5)) => {
                    if let Some(client_info) = store_.get_client_info().await {
                        info!("client is running under configuration: {:?}", client_info);
                        let _ = window_.emit_all("update_client_info", client_info);
                    }
                }
                _ = ct.cancelled() => {
                    info!("client info update cancelled");
                    break;
                }
            }
        }
    });

    let config = ownserver::Config {
        control_port: 5000,
        token_server,
        ping_interval: 15,
    };

    let request = RequestType::NewClient {
        endpoint_claims
    };
    match run_client(&config, store, cancellation_token, request).await {
        Ok(r) => r,
        Err(e) => {
            window.unlisten(unlisten);
            return Err(LaunchResultError::LaunchFailed{ message: e.to_string() });
        }
    }


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
