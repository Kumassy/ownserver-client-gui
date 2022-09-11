use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind")]
pub enum LaunchResultError {
    LaunchFailed {
        message: String
    },
    InternalClientError {
        message: String
    },
    ClientExited {
        message: String
    }
}

pub type LaunchResult = Result<(), LaunchResultError>;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind")]
pub enum CreateEulaError {
    IoError {
        message: String
    },
}
