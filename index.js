const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");

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
        numbers.map((number, ind) => {
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
          }, 2000 * ind);
        })
      );
      parentResolve(results);
    } catch (e) {
      parentReject(e);
    }
  });
};

// sendRequests(1);
// const run = async () => {
//   for (let i = 1; i <= totalPages; ) {
//     const result = await sendRequests(i);
//     // console.log(result);
//   }
// };

// run();

for (let i = 1; i <= totalPages; i += requestsPerMinute) {
  sendRequests(i).then(() => {
    console.log("done with the function");
  });
}
