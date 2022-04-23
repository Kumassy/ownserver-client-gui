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
    StatusCodeError,
    SpawnFailed(String),
    NoStdout,
    NoStderr,
    LineCorrupted(String),
    WaitFailed,
}

pub type LaunchLocalResult = Result<(), LaunchLocalResultError>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocalMessage {
    pub message: String,
}
