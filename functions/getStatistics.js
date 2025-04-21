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
    // GitHub repository details
    const owner = 'SalyyS1';
    const repo = 'checkscammcvn.github.io';
    
    // GitHub API endpoint for getting issues
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?labels=scam-report&state=all&per_page=100`;
    
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
    
    const issues = response.data;
    
    // Calculate statistics
    const stats = {
      total_reports: issues.length,
      verified_reports: issues.filter(issue => issue.labels.some(label => label.name === 'verified')).length,
      resolved_reports: issues.filter(issue => issue.labels.some(label => label.name === 'resolved')).length,
      false_reports: issues.filter(issue => issue.labels.some(label => label.name === 'false-report')).length,
      pending_reports: issues.filter(issue => issue.labels.some(label => label.name === 'pending')).length,
      total_votes: issues.reduce((sum, issue) => sum + (issue.reactions ? (issue.reactions['+1'] || 0) + (issue.reactions['-1'] || 0) : 0), 0)
    };
    
    // Return the successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: stats
      })
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    
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
