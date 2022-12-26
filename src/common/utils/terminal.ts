import * as childProcess from 'child_process';

export const terminal = async (cmd: string): Promise<string> => new Promise(async (resolve, reject) => {
  await childProcess.exec(cmd, { maxBuffer: 1024 * 1500 }, (err, stdout, stderr) => {
    if (err) {
      reject(err);
    }
    resolve(stderr ? stderr : stdout);
  });

});