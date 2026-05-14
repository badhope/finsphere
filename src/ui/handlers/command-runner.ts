import { spawn } from 'child_process';
import { printError } from '../logo.js';

/**
 * Run a CLI subcommand in a child process
 */
export function runSubCommand(args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const cliPath = process.argv[1];
    const child = spawn('node', [cliPath, ...args], {
      stdio: 'inherit',
      shell: true,
    });
    child.on('close', (code) => resolve(code ?? 0));
    child.on('error', (err) => {
      printError(`子命令启动失败: ${err.message}`);
      resolve(1);
    });
  });
}
