use log::{Level, Log, Metadata, Record};
use ownserver::recorder::{init_recorder, Event, EventRecorder};
use std::sync::{Arc, OnceLock};
use tauri::{Manager, Window};

pub struct TauriLogger {
    window: Arc<Window>,
}

impl TauriLogger {
    pub fn new(window: Window) -> Self {
        Self {
            window: Arc::new(window),
        }
    }
}

impl Log for TauriLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= Level::Info
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            let message = format!("[{}] {}", record.level(), record.args());

            // Forward to frontend
            let window = self.window.clone();
            let message = message.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = window.emit("log", message) {
                    eprintln!("Failed to emit log to frontend: {}", e);
                }
            });
        }
    }

    fn flush(&self) {}
}


#[derive(Debug)]
pub struct TauriRecorder {
    window: Arc<Window>,
}


impl EventRecorder for TauriRecorder {
    fn log(&self, event: Event) {
        match event {
            Event::UpdateClientInfo(client_info) => {
                println!("Your Client ID: {}", client_info.client_id);
                println!("Endpoint Info:");
                for endpoint in client_info.endpoints.iter() {
                    let message = format!("{}://localhost:{} <--> {}://{}:{}", endpoint.protocol, endpoint.local_port, endpoint.protocol, client_info.host, endpoint.remote_port);
                    println!("+{}+", "-".repeat(message.len() + 2));
                    println!("| {} |", message);
                    println!("+{}+", "-".repeat(message.len() + 2));
                }

                let _ = self.window.emit_all("update_client_info", client_info);
            },
            _ => {}
        }
    }
}


pub fn init_tauri_event_recorder(window: Window) -> Result<(), &'static dyn EventRecorder> {
    let recorder = TauriRecorder { window: Arc::new(window) };
    init_recorder(Box::leak(Box::new(recorder)))
}