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
    // Get the limit from query parameters
    const limit = parseInt(event.queryStringParameters.limit || '3');
    
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
    
    // Extract scammer information from issue titles and count reports
    const scammerCounts = {};
    
    for (const issue of issues) {
      // Parse title to extract Minecraft username
      const match = issue.title.match(/\[REPORT\] (.*?) - /);
      if (match && match[1]) {
        const username = match[1];
        
        if (!scammerCounts[username]) {
          scammerCounts[username] = {
            name: username,
            count: 0,
            discord: '',
            discord_name: '',
            confirmVotes: 0
          };
          
          // Extract Discord ID from title
          const discordMatch = issue.title.match(/ - (\d+)/);
          if (discordMatch && discordMatch[1]) {
            scammerCounts[username].discord = discordMatch[1];
          }
          
          // Extract Discord name from body (simplified)
          const bodyMatch = issue.body.match(/\*\*Discord Name\*\*: (.*?)(?:\r?\n|$)/);
          if (bodyMatch && bodyMatch[1] && bodyMatch[1] !== 'N/A') {
            scammerCounts[username].discord_name = bodyMatch[1];
          }
        }
        
        scammerCounts[username].count++;
        
        // Count confirm votes (thumbs up reactions)
        if (issue.reactions && issue.reactions['+1']) {
          scammerCounts[username].confirmVotes += issue.reactions['+1'];
        }
      }
    }
    
    // Convert to array and sort
    const scammers = Object.values(scammerCounts);
    scammers.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return b.confirmVotes - a.confirmVotes;
    });
    
    // Return the successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: scammers.slice(0, limit)
      })
    };
  } catch (error) {
    console.error('Error getting top scammers:', error);
    
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
