const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");
const sleep = require("util").promisify(setTimeout);

const requestsPerMinute = 22;
const intervalTimeSeconds = 5;
const totalPages = 23; //3860;
const workerPath = path.resolve("request-worker.js");

const sendRequests = (pageStart) => {
  return new Promise(async (parentResolve, parentReject) => {
    const numbers = [...new Array(requestsPerMinute)].map(
      (_, i) => pageStart + i
    );
    try {
      const results = await Promise.all(
        numbers.map(async (number, ind) => {
          if (number > totalPages) return;
          await sleep(ind * 2000);
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
      parentResolve(results);
    } catch (e) {
      parentReject(e);
    }
  });
};

// sendRequests(1);

const run = async () => {
  for (let i = 1; i <= totalPages; ) {
    console.log("Starting for i: " + i);
    await sendRequests(i);
    console.log("Done with the function");
    await sleep(intervalTimeSeconds * 1000);
    i += requestsPerMinute;
  }
};

run();
