// Image upload handling for CheckScam Minecraft
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('proof-images-upload');
    const hiddenInput = document.getElementById('proof-images');
    const previewContainer = document.getElementById('image-preview-container');
    
    // Maximum number of images allowed
    const MAX_IMAGES = 5;
    
    // Array to store uploaded images as base64
    let uploadedImages = [];
    
    // Handle file selection
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Handle file selection
    function handleFileSelect(event) {
        const files = event.target.files;
        
        // Check if files were selected
        if (!files || files.length === 0) return;
        
        // Check if maximum number of images would be exceeded
        if (uploadedImages.length + files.length > MAX_IMAGES) {
            showNotification('error', `Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh`);
            return;
        }
        
        // Process each file
        Array.from(files).forEach(file => {
            // Validate file type
            if (!file.type.match('image.*')) {
                showNotification('error', 'Chỉ chấp nhận file ảnh');
                return;
            }
            
            // Read file as data URL
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                
                // Add to uploaded images array
                uploadedImages.push({
                    name: file.name,
                    data: imageData,
                    type: file.type
                });
                
                // Update hidden input value
                updateHiddenInput();
                
                // Add preview
                addImagePreview(imageData, uploadedImages.length - 1);
                
                // Show preview container if it was hidden
                if (previewContainer.classList.contains('hidden')) {
                    previewContainer.classList.remove('hidden');
                }
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // Add image preview to container
    function addImagePreview(imageData, index) {
        const previewElement = document.createElement('div');
        previewElement.className = 'relative';
        previewElement.innerHTML = `
            <img src="${imageData}" alt="Preview" class="w-full h-24 object-cover rounded-lg">
            <button type="button" data-index="${index}" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 remove-image">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add remove button event listener
        const removeButton = previewElement.querySelector('.remove-image');
        removeButton.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeImage(index);
        });
        
        previewContainer.appendChild(previewElement);
    }
    
    // Remove image from uploaded images
    function removeImage(index) {
        // Remove from array
        uploadedImages.splice(index, 1);
        
        // Update hidden input
        updateHiddenInput();
        
        // Rebuild preview container
        rebuildPreviewContainer();
        
        // Hide preview container if no images
        if (uploadedImages.length === 0) {
            previewContainer.classList.add('hidden');
        }
    }
    
    // Rebuild preview container
    function rebuildPreviewContainer() {
        // Clear container
        previewContainer.innerHTML = '';
        
        // Add previews for all images
        uploadedImages.forEach((image, index) => {
            addImagePreview(image.data, index);
        });
    }
    
    // Update hidden input with JSON string of uploaded images
    function updateHiddenInput() {
        hiddenInput.value = JSON.stringify(uploadedImages);
    }
    
    // Add drag and drop support
    const dropZone = document.querySelector('.border-dashed');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropZone.classList.add('border-blue-400', 'bg-gray-700');
        }
        
        function unhighlight() {
            dropZone.classList.remove('border-blue-400', 'bg-gray-700');
        }
        
        dropZone.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                fileInput.files = files;
                handleFileSelect({target: {files: files}});
            }
        }
    }
});
