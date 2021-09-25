use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LaunchResultError {
    LaunchFailed(String),
    InternalClientError(String),
    ClientExited(String),
}

pub type LaunchResult = Result<(), LaunchResultError>;

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "kind", content = "payload")]
pub enum LaunchLocalResultError {
    SpawnFailed(String),
    NoStdout,
    LineCorrupted(String),
}

pub type LaunchLocalResult = Result<(), LaunchLocalResultError>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocalMessage {
    pub message: String,
}
