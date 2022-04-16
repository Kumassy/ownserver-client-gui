export type LaunchResult =
  | {
    Ok: null;
    [k: string]: unknown;
  }
  | {
    Err: LaunchResultError;
    [k: string]: unknown;
  };

export type LaunchResultError =
  | {
    LaunchFailed: string;
  }
  | {
    InternalClientError: string;
  }
  | {
    ClientExited: string;
  };

// export type LaunchLocalResult =
//   | {
//     Ok: null;
//     [k: string]: unknown;
//   }
//   | {
//     Err: LaunchLocalResultError;
//     [k: string]: unknown;
//   };

export type LaunchLocalResultError =
  | {
    kind: "SpawnFailed";
    payload: string;
    [k: string]: unknown;
  }
  | {
    kind: "NoStdout";
    [k: string]: unknown;
  }
  | {
    kind: "NoStderr";
    [k: string]: unknown;
  }
  | {
    kind: "LineCorrupted";
    payload: string;
    [k: string]: unknown;
  };

export interface LocalMessage {
  message: string;
  [k: string]: unknown;
}
