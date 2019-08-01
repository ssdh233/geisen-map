require('dotenv').config();

module.exports = {
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    NO_GOOGLE_ANALYTICS: process.env.NO_GOOGLE_ANALYTICS
  }
};
