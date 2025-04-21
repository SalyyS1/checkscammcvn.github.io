const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const voteData = JSON.parse(event.body);
    
    // Validate required fields
    if (!voteData.issueNumber || !voteData.voteType) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields: issueNumber and voteType'
        })
      };
    }
    
    // GitHub repository details
    const owner = 'SalyyS1';
    const repo = 'checkscammcvn.github.io';
    
    // Convert vote type to reaction content
    const content = voteData.voteType === 'confirm' ? '+1' : '-1';
    
    // GitHub API endpoint for adding reactions
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${voteData.issueNumber}/reactions`;
    
    // Make the request to GitHub API
    const response = await axios.post(
      apiUrl,
      {
        content: content
      },
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );
    
    // Return the successful response
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: 'Vote submitted successfully',
        data: response.data
      })
    };
  } catch (error) {
    console.error('Error voting on report:', error);
    
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
