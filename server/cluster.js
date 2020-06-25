// const newrelic = require('newrelic');
const cluster = require('cluster');

// If the process is the Master Process than fork off n-cores clusters available
if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function () {
    cluster.fork();
  });
} else {
  // If cluster is worker process then run instance of app.js
  require('./app');
}
