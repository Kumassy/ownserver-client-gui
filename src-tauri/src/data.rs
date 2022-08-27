use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LaunchResultError {
    LaunchFailed(String),
    InternalClientError(String),
    ClientExited(String),
}

pub type LaunchResult = Result<(), LaunchResultError>;
