/**
 * Script to check if the vibe-check-mcp-server is running
 */
const http = require('http');

// Function to check if the server is running
function checkServer() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Main function
async function main() {
  console.log('Checking if vibe-check-mcp-server is running...');
  
  const isRunning = await checkServer();
  
  if (isRunning) {
    console.log('✅ vibe-check-mcp-server is running!');
    console.log('You can now run the VibeCheck proof of concept:');
    console.log('node run-vibe-check-poc.js');
  } else {
    console.log('❌ vibe-check-mcp-server is not running!');
    console.log('\nTo start the server:');
    console.log('1. Clone the repository:');
    console.log('   git clone https://github.com/AcidicSoil/vibe-check-mcp-server.git');
    console.log('2. Navigate to the directory:');
    console.log('   cd vibe-check-mcp-server');
    console.log('3. Install dependencies:');
    console.log('   npm install');
    console.log('4. Start the server:');
    console.log('   npm start');
    console.log('\nOnce the server is running, you can run the VibeCheck proof of concept:');
    console.log('node run-vibe-check-poc.js');
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
