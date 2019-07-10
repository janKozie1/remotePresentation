var Service = require('node-windows').Service;
process.chdir(__dirname);

// Create a new service object
var svc;

switch (process.argv[2]) {
  case '--add':
    svc = new Service({
      name: 'Presentation server',
      description: 'Server for sending images',
      script: 'C:\\Users\\in99037\\Documents\\scripts\\prezentacja\\server.js',
      nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
      ]
    });
    if (svc.exists) {
      console.log('\nThis service is already installed and should be running automatically')
      console.log('If it\'s not running properly, check services.msc\n')
      break;
    } else {
      svc.install();
      svc.on('install', function () {
        svc.start();
        console.log('\nThe service has been installed successfully and should launch automatically\n')
      });
      break;
    }
  case '--remove':
    svc = new Service({
      name: 'Presentation server',
      script: 'C:\\Users\\in99037\\Documents\\scripts\\prezentacja\\server.js'
    });
    if (svc.exists) {
      console.log("\nRunning...")
      svc.uninstall();
      svc.on('uninstall',function(){
        console.log('This service has been removed successfully.\n');
      });
      break;
    } else {
      console.log('\nThis service has already been uninstalled');
      console.log('If it\'s still running, check services.msc\n');
      break;
    }

  default:
    svc = new Service({
      name: 'Presentation server',
      script: 'C:\\Users\\in99037\\Documents\\scripts\\prezentacja\\server.js'
    });
    console.log("\nusage: node pres_service.js --add     //installs the service");
    console.log("       node pres_service.js --remove      //removes the service");
    console.log(`\nService status: ${svc.exists ? 'installed' : 'not installed'}\n`)
    break;
}

