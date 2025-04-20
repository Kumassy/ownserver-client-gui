import { checkRegistry, CHECK_JAVA_VERSION } from "./checks";
import { Command } from '@tauri-apps/plugin-shell';

jest.mock('@tauri-apps/api/shell');

beforeEach(() => {
  Command.mockClear();
});


describe('check-java-version', () => {
  const TEST_ID = CHECK_JAVA_VERSION;
  test('should resolve with version info', async () => {
    Command.mockImplementation(() => {
      return {
        execute: () => {
          return Promise.resolve({
            code: 0,
            stdout:
              `openjdk 18 2022-03-22
OpenJDK Runtime Environment (build 18+36-2087)
OpenJDK 64-Bit Server VM (build 18+36-2087, mixed mode, sharing)`,
            stderr: ""
          })
        },
      };
    });


    await expect(checkRegistry[TEST_ID]()).resolves.toBe(
      `openjdk 18 2022-03-22
OpenJDK Runtime Environment (build 18+36-2087)
OpenJDK 64-Bit Server VM (build 18+36-2087, mixed mode, sharing)`);
  });

  test('should throw an error when java not installed on macOS', async () => {
    Command.mockImplementation(() => {
      return {
        execute: () => {
          return Promise.resolve({
            code: 1,
            stdout: "",
            stderr:
              `The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.`
          })
        },
      };
    });


    await expect(checkRegistry[TEST_ID]()).rejects.toThrow(
      `test exited with non-zero code: 1, stderr: The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java`);
  });

  test('should throw an error when java not installed on Ubuntu', async () => {
    Command.mockImplementation(() => {
      return {
        execute: () => {
          return Promise.resolve({
            code: 127,
            stdout: "",
            stderr:
              `Command 'java' not found, but can be installed with:
apt install openjdk-11-jre-headless  # version 11.0.14+9-0ubuntu2~22.10, or
apt install default-jre              # version 2:1.11-72
apt install openjdk-17-jre-headless  # version 17.0.2+8-1~22.10
apt install openjdk-8-jre-headless   # version 8u312-b07-0ubuntu1~21.10
apt install openjdk-15-jre-headless  # version 15.0.3+3-1
apt install openjdk-16-jre-headless  # version 16.0.1+9-1
Ask your administrator to install one of them.`
          })
        },
      };
    });


    await expect(checkRegistry[TEST_ID]()).rejects.toThrow(
      `test exited with non-zero code: 127, stderr: Command 'java' not found, but can be installed with:
apt install openjdk-11-jre-headless  # version 11.0.14+9-0ubuntu2~22.10, or
apt install default-jre              # version 2:1.11-72
apt install openjdk-17-jre-headless  # version 17.0.2+8-1~22.10
apt install openjdk-8-jre-headless   # version 8u312-b07-0ubuntu1~21.10
apt install openjdk-15-jre-headless  # version 15.0.3+3-1
apt install openjdk-16-jre-headless  # version 16.0.1+9-1
Ask your administrator to install one of them.`);
  });
})
