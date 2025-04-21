// Netlify Function for GitHub API integration
const axios = require('axios');

// Maximum payload size (10MB)
const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024;

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse request body
    const payload = JSON.parse(event.body);
    
    // Check payload size
    if (event.body.length > MAX_PAYLOAD_SIZE) {
      console.error('Payload too large:', event.body.length);
      return {
        statusCode: 413,
        headers,
        body: JSON.stringify({ 
          error: 'Payload too large',
          message: 'The request payload exceeds the maximum allowed size'
        })
      };
    }
    
    // Get GitHub token from environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      console.error('GitHub token not found in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Configuration error',
          message: 'GitHub token not configured'
        })
      };
    }
    
    // Extract request parameters
    const { action, repo, owner, path, content, message, sha } = payload;
    
    // GitHub API base URL
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    
    // Configure axios with GitHub token
    const githubApi = axios.create({
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    });
    
    let response;
    
    // Handle different actions
    switch (action) {
      case 'getContent':
        // Get file content
        response = await githubApi.get(`${baseUrl}/contents/${path}`);
        break;
        
      case 'updateFile':
        // Check if file exists first to get SHA
        let fileSha = sha;
        if (!fileSha) {
          try {
            const fileResponse = await githubApi.get(`${baseUrl}/contents/${path}`);
            fileSha = fileResponse.data.sha;
          } catch (error) {
            // File doesn't exist, will be created
            console.log('File does not exist, will create new file');
          }
        }
        
        // Update or create file
        const updateData = {
          message,
          content: Buffer.from(content).toString('base64')
        };
        
        // Add SHA if file exists (update)
        if (fileSha) {
          updateData.sha = fileSha;
        }
        
        response = await githubApi.put(`${baseUrl}/contents/${path}`, updateData);
        break;
        
      case 'createIssue':
        // Create a new issue
        response = await githubApi.post(`${baseUrl}/issues`, {
          title: payload.title,
          body: payload.body,
          labels: payload.labels || []
        });
        break;
        
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
    
    // Return successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
    
  } catch (error) {
    // Log detailed error information
    console.error('GitHub API Error:', error);
    
    // Extract error details
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : error.message;
    
    // Return error response
    return {
      statusCode,
      headers,
      body: JSON.stringify({
        error: 'GitHub API Error',
        message: errorMessage,
        details: error.toString()
      })
    };
  }
};
