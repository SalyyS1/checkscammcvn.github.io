// Imgur API integration for image handling
class ImgurStorage {
  constructor() {
    // Imgur API client ID (this is a demo client ID, should be replaced with your own)
    this.clientId = 'f642949e4d6d0c3';
    this.apiUrl = 'https://api.imgur.com/3/image';
  }
  
  // Upload a single image to Imgur
  async uploadImage(imageData) {
    try {
      // Extract base64 data (remove data:image/xxx;base64, prefix)
      const base64Data = imageData.split(',')[1];
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('image', base64Data);
      formData.append('type', 'base64');
      
      // Make API request to Imgur
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${this.clientId}`
        },
        body: formData
      });
      
      // Parse response
      const result = await response.json();
      
      // Check if upload was successful
      if (result.success) {
        return {
          success: true,
          url: result.data.link,
          deleteHash: result.data.deletehash
        };
      } else {
        throw new Error(result.data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error uploading image to Imgur:', error);
      return {
        success: false,
        message: error.message || 'Failed to upload image to Imgur'
      };
    }
  }
  
  // Upload multiple images to Imgur
  async uploadImages(images) {
    try {
      const imageUrls = [];
      
      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // Upload image to Imgur
        const result = await this.uploadImage(image.data);
        
        if (result.success) {
          // Store image URL
          imageUrls.push({
            url: result.url,
            deleteHash: result.deleteHash
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
      console.error('Error uploading images to Imgur:', error);
      return {
        success: false,
        message: 'Failed to upload images to Imgur: ' + error.message
      };
    }
  }
  
  // Delete an image from Imgur
  async deleteImage(deleteHash) {
    try {
      // Make API request to delete the image
      const response = await fetch(`${this.apiUrl}/${deleteHash}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Client-ID ${this.clientId}`
        }
      });
      
      // Parse response
      const result = await response.json();
      
      return {
        success: result.success,
        message: result.success ? 'Image deleted successfully' : (result.data.error || 'Failed to delete image')
      };
    } catch (error) {
      console.error('Error deleting image from Imgur:', error);
      return {
        success: false,
        message: 'Failed to delete image from Imgur: ' + error.message
      };
    }
  }
}

// Explicitly expose the class to the global window object
window.ImgurStorage = ImgurStorage;
