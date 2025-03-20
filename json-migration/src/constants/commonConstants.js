const API_BASE_URL = 'https://api.surveysparrow.com/v3/';
const header = {
  options: {
    headers: {
      Authorization: 'Bearer <%= iparams.surveysparrow_api_key %>',
    },
  },
};

const message = {
  success:'success',
  error:'failure'
};

module.exports = {
  API_BASE_URL,
  header,
  message
};