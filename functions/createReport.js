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
    const reportData = JSON.parse(event.body);
    
    // GitHub repository details
    const owner = 'SalyyS1';
    const repo = 'checkscammcvn.github.io';
    
    // GitHub API endpoint for creating issues
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues`;
    
    // Format the report body in markdown
    const body = formatReportBody(reportData);
    
    // Create the issue title
    const title = `[REPORT] ${reportData.minecraftName} - ${reportData.discordId}`;
    
    // Make the request to GitHub API
    const response = await axios.post(
      apiUrl,
      {
        title: title,
        body: body,
        labels: ['scam-report', 'pending']
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
        message: 'Report submitted successfully',
        data: {
          id: response.data.number,
          url: response.data.html_url
        }
      })
    };
  } catch (error) {
    console.error('Error creating report:', error);
    
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

// Helper function to format the report body
function formatReportBody(reportData) {
  // Split proof images by comma and trim whitespace
  const proofImages = reportData.proofImages
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .map(url => `- [Evidence](${url})`)
    .join('\n');

  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  return `## Scammer Information
- **Minecraft Username**: ${reportData.minecraftName}
- **Discord ID**: ${reportData.discordId}
- **Discord Name**: ${reportData.discordName || 'N/A'}
- **Facebook Link**: ${reportData.facebookLink || 'N/A'}
- **Server**: ${reportData.server || 'Other'}

## Incident Details
${reportData.description}

## Evidence
${proofImages}

---
*Report submitted on ${currentDate} via CheckScam Minecraft*`;
}
