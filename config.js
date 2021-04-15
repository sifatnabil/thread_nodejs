const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  api_url: process.env.API_URL,
  api_cookie: process.env.COOKIE,
};
