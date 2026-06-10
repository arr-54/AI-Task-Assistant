const axios = require('axios');

const analyzeTaskText = async (text) => {
  try {
    const response = await axios.post(process.env.PYTHON_ANALYZE_URL, { text });
    return response.data;
  } catch (error) {
    console.error('Python service error:', error.message);
    return { priority: 'medium', category: 'general' };
  }
};

module.exports = { analyzeTaskText };