const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}Care4Crisis - Installing all dependencies${colors.reset}`);

// Function to run a command in a specific directory
function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.yellow}Running '${command} ${args.join(' ')}' in ${cwd}${colors.reset}`);
    
    const child = spawn(command, args, {
      cwd,
      shell: true,
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command '${command} ${args.join(' ')}' exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

async function installDependencies() {
  try {
    // Install root dependencies
    console.log(`\n${colors.blue}Installing frontend dependencies...${colors.reset}`);
    await runCommand('npm', ['install'], process.cwd());
    
    // Install server dependencies
    const serverDir = path.join(process.cwd(), 'server');
    
    // Check if server directory exists
    if (fs.existsSync(serverDir)) {
      console.log(`\n${colors.blue}Installing backend dependencies...${colors.reset}`);
      await runCommand('npm', ['install'], serverDir);
    } else {
      console.log(`${colors.red}Server directory not found. Skipping backend dependencies.${colors.reset}`);
    }
    
    console.log(`\n${colors.green}✓ All dependencies installed successfully!${colors.reset}`);
    console.log(`\n${colors.blue}To start the development server:${colors.reset}`);
    console.log(`${colors.yellow}npm run dev${colors.reset} - Start frontend only`);
    console.log(`${colors.yellow}npm run server${colors.reset} - Start backend only`);
    console.log(`${colors.yellow}npm run dev:all${colors.reset} - Start both frontend and backend`);
    
  } catch (error) {
    console.error(`\n${colors.red}Error installing dependencies:${colors.reset}`, error);
    process.exit(1);
  }
}

installDependencies(); 