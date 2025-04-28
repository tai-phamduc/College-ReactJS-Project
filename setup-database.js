const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runScript(scriptPath) {
  try {
    console.log(`Running ${scriptPath}...`);
    const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
    console.log(stdout);
    if (stderr) {
      console.error(`Error in ${scriptPath}:`, stderr);
    }
    console.log(`Finished ${scriptPath}\n`);
  } catch (error) {
    console.error(`Error executing ${scriptPath}:`, error);
  }
}

async function setupDatabase() {
  console.log('Starting database setup...');
  
  // Run scripts in sequence
  await runScript('./add-theaters.js');
  await runScript('./add-upcoming-movies.js');
  await runScript('./add-showtimes.js');
  
  console.log('Database setup complete!');
}

setupDatabase();
