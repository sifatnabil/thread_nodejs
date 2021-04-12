const cluster = require("cluster");

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (i = 0; i < 24; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} dies with id ${worker.id}`);
  });
} else {
  console.log(`Worker ${process.pid} started with id ${cluster.worker.id}`);
  process.exit(0);
}
