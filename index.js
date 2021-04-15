const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");

const requestsPerMinute = 1;
const workerPath = path.resolve("request-worker.js");

const sendRequests = (pageStart) => {
  return new Promise(async (parentResolve, parentReject) => {
    const numbers = [...new Array(requestsPerMinute)].map(
      (_, i) => pageStart + i
    );
    try {
      const results = await Promise.all(
        numbers.map((number) => {
          new Promise((resolve, reject) => {
            const worker = new Worker(workerPath, {
              workerData: number,
            });
            worker.on("message", resolve);
            worker.on("error", reject);
            worker.on("exit", (code) => {
              if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
            });
          });
        })
      );
      //   console.log(results);
      parentResolve(results);
    } catch (e) {
      parentReject(e);
    }
  });
};

sendRequests(1);
