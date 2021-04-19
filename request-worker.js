const axios = require("axios");
const { parentPort, workerData } = require("worker_threads");
const { api_url, api_cookie } = require("./config");
const fs = require("fs");

const pageNo = workerData;
const options = {
  headers: {
    "Content-Type": "application/json",
    Cookie: api_cookie,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
  },
};

const url = api_url + pageNo;

const data = {
  address: "",
  city: "",
  codbases: ["WBE"],
  duplicates: false,
  externalIdentifier: "",
  firstName: "",
  individualEid: "",
  isInContract: false,
  lastName: "",
  onekeyId: "",
  phonetic: false,
  postCode: "",
  specialties: [
    "09",
    "55",
    "57",
    "24",
    "D3",
    "08",
    "14",
    "75",
    "16",
    "97",
    "43",
    "18",
    "30",
    "06",
    "01",
    "11",
    "21",
    "81",
    "22",
    "20",
    "3B",
    "92",
    "74",
    "77",
    "29",
    "91",
    "99",
    "62",
    "35",
    "38",
    "33",
    "42",
    "41",
    "53",
    "44",
    "2A",
    "88",
    "58",
    "36",
    "59",
    "46",
    "8R",
    "49",
    "26",
    "2D",
    "25",
    "54",
  ],
};

// axios
//   .post(url, data, options)
//   .then((response) => {
//     jsonContent = JSON.stringify(response.data);
//     fs.writeFile(
//       "data/belgium_" + pageNo + ".json",
//       jsonContent,
//       "utf8",
//       (err) => {
//         if (err) {
//           console.log(
//             "An error occured during writing the JSON object to file"
//           );
//           console.log(err);
//         }
//         console.log("Done for page: " + pageNo);
//       }
//     );
//   })
//   .catch((err) => {
//     fs.appendFile("error_log.txt", url + "\n", () => {});
//   });

// const doWork = async () => {
//   await axios
//     .post(url, data, options)
//     .then((res) => {
//       console.log("Done for the page: " + pageNo);
//     })
//     .catch((err) => {
//       fs.appendFile("error_log.txt", url + "\n", () => {});
//     });
//   parentPort.postMessage(url);
// };

// doWork();
// console.log("triggered page: " + pageNo);

const result = pageNo + 1;

parentPort.postMessage(result);
