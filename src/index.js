const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  const command = core.getInput('command', { required: true });
  const maxAttempts = parseInt(core.getInput('max_attempts', { required: true }), 10);
  const timeoutMinutes = parseInt(core.getInput('timeout_minutes', { required: true }), 10);

  let attempt = 1;
  while (attempt <= maxAttempts) {
    try {
      await exec.exec(command);
      core.info(`Command succeeded on attempt ${attempt}.`);
      return;
    } catch (error) {
      core.warning(`Attempt ${attempt} failed. Retrying...`);
      attempt++;
      if (attempt > maxAttempts) {
        core.setFailed(`Command failed after ${maxAttempts} attempts.`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, timeoutMinutes * 60 * 1000));
    }
  }
}

run();