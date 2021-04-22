const { default: axios } = require("axios");
const { parentPort, workerData } = require("worker_threads");
const { api_url, api_cookie } = require("./config");
const fs = require("fs");

const number = workerData;
const timeOut = 6 * 60 * 1000;

const options = {
  headers: {
    "Content-Type": "application/json",
    Cookie: api_cookie,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
  },
  timeout: timeOut,
};

const url = api_url + number;

const data = {
  address: "",
  city: "",
  codbases: ["WDE"],
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
    "2C",
    "D1",
    "04",
    "03",
    "27",
    "D3",
    "08",
    "10",
    "69",
    "73",
    "R9",
    "65",
    "6F",
    "16",
    "70",
    "18",
    "06",
    "01",
    "L0",
    "11",
    "22",
    "20",
    "81",
    "92",
    "4R",
    "29",
    "1D",
    "8K",
    "34",
    "62",
    "35",
    "39",
    "37",
    "B1",
    "4W",
    "J0",
    "33",
    "D2",
    "41",
    "Q6",
    "Z4",
    "53",
    "44",
    "88",
    "48",
    "1N",
    "58",
    "1B",
    "45",
    "36",
    "L4",
    "7Z",
    "71",
    "49",
    "14",
    "T0",
    "51",
  ],
};

const runQuery = async () => {
  await axios
    .post(url, data, options)
    .then((response) => {
      jsonContent = JSON.stringify(response.data);
      fs.writeFile(
        "data/Germany/germany_" + number + ".json",
        jsonContent,
        "utf8",
        (err) => {
          if (err) {
            console.log(
              "An error occured during writing the JSON object to file"
            );
            console.log(err);
          } else console.log("Done for page: " + number);
        }
      );
      parentPort.postMessage(number);
    })
    .catch((err) => {
      fs.appendFile("error_log_germany.txt", number + "\n", (err) => {
        console.log(`Page ${number} faced an error due to timeout`);
      });
      parentPort.postMessage(number);
    });
};

runQuery();
