// GitHub Gist Storage for image handling
class GitHubGistStorage {
  constructor(repoOwner) {
    this.repoOwner = repoOwner;
    this.baseUrl = 'https://api.github.com/gists';
  }
  
  // Create a GitHub Gist for an image
  async createImageGist(imageData, imageName, reportId) {
    try {
      // Extract base64 data (remove data:image/xxx;base64, prefix)
      const base64Data = imageData.split(',')[1];
      
      // Create a unique filename
      const filename = `${reportId}_${imageName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      
      // Create Gist content
      const files = {};
      files[filename] = {
        content: base64Data
      };
      
      // Gist description
      const description = `Image for report ${reportId}`;
      
      // Gist data
      const gistData = {
        description: description,
        public: false, // Private Gist
        files: files
      };
      
      // In a real implementation, this would make an API call to create the Gist
      // For demonstration, we'll simulate the process
      console.log('Creating Gist for image:', filename);
      
      // Simulate Gist creation with a unique ID
      const gistId = 'gist_' + Math.random().toString(36).substring(2, 15);
      
      // Return the Gist URL and ID
      return {
        success: true,
        gistId: gistId,
        gistUrl: `https://gist.github.com/${this.repoOwner}/${gistId}`,
        rawUrl: `https://gist.githubusercontent.com/${this.repoOwner}/${gistId}/raw/${filename}`,
        imageType: imageData.split(';')[0].split('/')[1]
      };
    } catch (error) {
      console.error('Error creating image Gist:', error);
      return {
        success: false,
        message: 'Failed to create image Gist: ' + error.message
      };
    }
  }
  
  // Upload multiple images to GitHub Gists
  async uploadImages(images, reportId) {
    try {
      const imageUrls = [];
      
      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // Create a Gist for the image
        const result = await this.createImageGist(image.data, image.name, reportId);
        
        if (result.success) {
          // Store image metadata
          imageUrls.push({
            url: result.rawUrl,
            gistId: result.gistId,
            type: result.imageType
          });
        } else {
          console.error('Failed to upload image:', result.message);
        }
      }
      
      return {
        success: true,
        images: imageUrls
      };
    } catch (error) {
      console.error('Error uploading images:', error);
      return {
        success: false,
        message: 'Failed to upload images: ' + error.message
      };
    }
  }
  
  // Get image URL from Gist
  getImageUrl(gistData) {
    // In a real implementation, this would construct the raw URL for the image
    return gistData.url;
  }
}

// Explicitly expose the class to the global window object
window.GitHubGistStorage = GitHubGistStorage;
