const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");
const fs = require("fs");
const sleep = require("util").promisify(setTimeout);

const workerPath = path.resolve("./request-worker.js");
const requestsPerMinute = 22;
const totalPages = 3860;
const intervalTimeSeconds = 5;

const sendRequests = (pageStart, numbers) => {
  // let arraySize = 0;
  // if (pageStart + requestsPerMinute < totalPages) arraySize = requestsPerMinute;
  // else arraySize = totalPages - pageStart + 1;

  // const numbers = [...new Array(arraySize)].map((_, i) => pageStart + i);

  const promises = numbers.map(async (number, ind) => {
    await sleep(2000 * ind);
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: number,
      });
      worker.on("message", resolve);
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

// const run = async () => {
//   for (let i = 2430; i <= totalPages; ) {
//     console.log("Batch starting page: " + i);
//     await sendRequests(i);
//     console.log("Done with the Batch\n");
//     await sleep(intervalTimeSeconds * 1000);
//     i += requestsPerMinute;
//   }
// };

const run = async () => {
  const fileContent = fs.readFileSync("germany_pages.txt", "utf8");
  const pageNumbers = fileContent.split("\n");
  for (let i = 0; i < pageNumbers.length; i += requestsPerMinute) {
    let arraySize = 0;
    let iterationCount = 0;
    const numbers = [];
    if (i + requestsPerMinute - 1 <= pageNumbers.length) {
      arraySize = requestsPerMinute;
      iterationCount = i + arraySize - 1;
    } else {
      arraySize = pageNumbers.length - i;
      iterationCount = i + arraySize - 1;
    }

    console.log("Array size: " + arraySize);
    console.log(iterationCount);

    for (let j = i; j <= iterationCount; j++) {
      numbers.push(pageNumbers[j].trim());
    }

    console.log("Batch starting page: " + pageNumbers[i]);
    await sendRequests(pageNumbers[i], numbers);
    console.log("Done with the Batch\n");
    await sleep(intervalTimeSeconds * 1000);
  }
};

run();
