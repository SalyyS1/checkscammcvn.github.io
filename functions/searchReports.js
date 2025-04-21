const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Get the search query from query parameters
    const query = event.queryStringParameters.q || '';
    
    // GitHub repository details
    const owner = 'SalyyS1';
    const repo = 'checkscammcvn.github.io';
    
    // Encode the search query
    const searchQuery = encodeURIComponent(`repo:${owner}/${repo} label:scam-report ${query}`);
    
    // GitHub API endpoint for searching issues
    const apiUrl = `https://api.github.com/search/issues?q=${searchQuery}`;
    
    // Make the request to GitHub API
    const response = await axios.get(
      apiUrl,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );
    
    // Return the successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: response.data
      })
    };
  } catch (error) {
    console.error('Error searching reports:', error);
    
    // Return the error response
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        success: false,
        message: error.response?.data?.message || 'Internal Server Error'
      })
    };
  }
};
