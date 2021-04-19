const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");
const sleep = require("util").promisify(setTimeout);

const requestsPerMinute = 5;
const intervalTimeSeconds = 5;
const totalPages = 1000; //3860;
const workerPath = path.resolve("request-worker.js");

const sendRequests = (pageStart) => {
  let arraySize = 0;
  if (pageStart + requestsPerMinute < totalPages) arraySize = requestsPerMinute;
  else arraySize = totalPages - pageStart + 1;

  const numbers = [...new Array(arraySize)].map((_, i) => pageStart + i);

  const results = numbers.map((number, ind) => {
    // await sleep(2000 * ind);
    new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: number,
      });
      worker.once("message", resolve);
      worker.on("eror", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  });

  return Promise.all(results).then((res) => console.log(res));
};

sendRequests(523);

// const run = async () => {
//   for (let i = 545; i <= totalPages; ) {
//     console.log("i: " + i);
//     await sendRequests(i).then(() => console.log("done with the function"));
//     await sleep(intervalTimeSeconds * 1000);
//     i += requestsPerMinute;
//   }
// };

// run();
