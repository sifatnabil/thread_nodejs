const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");
const sleep = require("util").promisify(setTimeout);

const workerPath = path.resolve("./request-worker.js");
const requestsPerMinute = 1;
const totalPages = 3860;
const intervalTimeSeconds = 3;

const sendRequests = (pageStart) => {
  let arraySize = 0;
  if (pageStart + requestsPerMinute < totalPages) arraySize = requestsPerMinute;
  else arraySize = totalPages - pageStart + 1;

  const numbers = [...new Array(arraySize)].map((_, i) => pageStart + i);

  const promises = numbers.map(async (number, ind) => {
    await sleep(2000 * ind);
    return new Promise((resolve, reject) => {
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

  return Promise.all(promises).then((res) => console.log(res));
};

// sendRequests(600).then(() => {
//   console.log("Done with the page");
// });

const run = async () => {
  for (let i = 547; i <= totalPages; ) {
    console.log("Batch starting page: " + i);
    await sendRequests(i);
    console.log("Done with the Batch\n");
    await sleep(intervalTimeSeconds * 1000);
    i += requestsPerMinute;
  }
};

run();
