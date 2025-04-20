#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod data;
mod logger;
use logger::init_tauri_event_recorder;
use std::{path::Path, sync::Arc};
use tauri::Manager;

use crate::data::{LaunchResult, LaunchResultError};
use data::CreateEulaError;
use ownserver::{
  proxy_client::{run_client, RequestType},
  Store,
};
use ownserver_lib::EndpointClaims;
use tokio::fs;
use tokio_util::sync::CancellationToken;

use crate::logger::TauriLogger;
use crate::logger::DEFAULT_LOG_LEVEL;

const EULA_CONTENT: &str = r#"
#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
eula=true
"#;

#[tauri::command]
async fn launch_tunnel(
  window: tauri::Window,
  token_server: String,
  endpoint_claims: EndpointClaims,
) -> LaunchResult {
  let cancellation_token = CancellationToken::new();
  let ct = cancellation_token.clone();
  let unlisten = window.once("interrupt_launch_tunnel", move |_| {
    ct.cancel();
  });

  let store = Arc::new(Store::default());

  let config = ownserver::Config {
    control_port: 5000,
    token_server,
    ping_interval: 15,
  };

  let request = RequestType::NewClient { endpoint_claims };
  match run_client(&config, store, cancellation_token, request).await {
    Ok(r) => r,
    Err(e) => {
      window.unlisten(unlisten);
      return Err(LaunchResultError::LaunchFailed {
        message: e.to_string(),
      });
    }
  }

  window.unlisten(unlisten);

  Ok(())
}

#[tauri::command]
async fn create_eula(basedir: String) -> Result<(), CreateEulaError> {
  let base = Path::new(&basedir);
  if !base.exists() {
    return Err(CreateEulaError::IoError {
      message: "basedir does not exist".into(),
    });
  }

  let path = base.join("eula.txt");
  fs::write(path, EULA_CONTENT)
    .await
    .map_err(|e| CreateEulaError::IoError {
      message: format!("failed to create eula.txt {}", e),
    })
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      let logger = TauriLogger::new(window.clone());
      log::set_boxed_logger(Box::new(logger))
        .map(|()| log::set_max_level(DEFAULT_LOG_LEVEL))
        .expect("Failed to initialize logger");

      init_tauri_event_recorder(window)
        .map_err(|_| "Failed to initialize event recorder")
        .unwrap();
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![launch_tunnel, create_eula,])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
