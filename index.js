const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");

const requestsPerMinute = 25;
const intervalTimeSeconds = 5;
const totalPages = 3860;
const workerPath = path.resolve("request-worker.js");

const sendRequests = (pageStart) => {
  return new Promise(async (parentResolve, parentReject) => {
    const numbers = [...new Array(requestsPerMinute)].map(
      (_, i) => pageStart + i
    );
    try {
      const results = await Promise.all(
        numbers.map((number, i) => {
          setTimeout(() => {
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
          }, 2000 * i);
        })
      );
      parentResolve(results);
    } catch (e) {
      parentReject(e);
    }
  });
};

sendRequests(1);

// let itr = 1;
// let workingPage = 1;
// const intervalID = setInterval(async () => {
//   await sendRequests(workingPage);
//   workingPage += requestsPerMinute;
//   itr++;
//   if (itr > requestsPerMinute) {
//     itr = 1;
//     clearInterval(intervalID);
//   }
// }, intervalTimeSeconds * 1000);
