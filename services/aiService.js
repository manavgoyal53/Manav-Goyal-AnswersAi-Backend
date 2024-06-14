const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function getAIAnswer(question) {
  const response = await axios.post('https://api.anthropic.com/v1/messages', {
    "model": "claude-3-opus-20240229",
    "max_tokens": 1024,
    "messages": [
        {"role": "user", "content": question}
    ]
    // other required parameters
  }, {
    headers: {
      'x-api-key': process.env.API_SECRET,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01"
    }
  })
  return response.data.content[0].text;
}

module.exports = { getAIAnswer };
