// mediaApi.js - API Helper for Media Library
// Place this file in: src/services/mediaApi.ts

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from storage
 */
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Common headers for API requests
 */
const getHeaders = (includeContentType = true) => {
  const headers = {
    'Authorization': `Bearer ${getAuthToken()}`
  };
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Media API Service
 */
export const mediaApi = {
  /**
   * Fetch all media with filters and pagination
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.type) queryParams.append('type', params.type);
    if (params.folder) queryParams.append('folder', params.folder);
    if (params.uploadedBy) queryParams.append('uploadedBy', params.uploadedBy);
    
    const response = await fetch(
      `${API_BASE_URL}/media?${queryParams}`,
      {
        headers: getHeaders()
      }
    );
    
    return handleResponse(response);
  },

  /**
   * Get single media by ID
   */
  async getById(id) {
    const response = await fetch(
      `${API_BASE_URL}/media/${id}`,
      {
        headers: getHeaders()
      }
    );
    
    return handleResponse(response);
  },

  /**
   * Upload media files
   */
  async upload(files, metadata = {}) {
    const formData = new FormData();
    
    // Append files
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Append metadata
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.folder) formData.append('folder', metadata.folder);
    if (metadata.public !== undefined) formData.append('public', metadata.public);
    if (metadata.tags) {
      if (Array.isArray(metadata.tags)) {
        metadata.tags.forEach(tag => formData.append('tags', tag));
      } else {
        formData.append('tags', metadata.tags);
      }
    }
    
    const response = await fetch(
      `${API_BASE_URL}/media/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      }
    );
    
    return handleResponse(response);
  },

  /**
   * Upload single file with progress tracking
   */
  async uploadWithProgress(file, metadata = {}, onProgress) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('files', file);
      
      // Append metadata
      if (metadata.title) formData.append('title', metadata.title);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.folder) formData.append('folder', metadata.folder);
      if (metadata.public !== undefined) formData.append('public', metadata.public);
      if (metadata.tags) formData.append('tags', metadata.tags);
      
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });
      
      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || `Upload failed: ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        }
      });
      
      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });
      
      xhr.open('POST', `${API_BASE_URL}/media/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${getAuthToken()}`);
      xhr.send(formData);
    });
  },

  /**
   * Update media metadata
   */
  async update(id, data) {
    const response = await fetch(
      `${API_BASE_URL}/media/${id}`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      }
    );
    
    return handleResponse(response);
  },

  /**
   * Delete media
   */
  async delete(id) {
    const response = await fetch(
      `${API_BASE_URL}/media/${id}`,
      {
        method: 'DELETE',
        headers: getHeaders()
      }
    );
    
    return handleResponse(response);
  },

  /**
   * Track media view
   */
  async trackView(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/media/${id}/view`,
        {
          method: 'POST',
          headers: getHeaders()
        }
      );
      
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to track view:', error);
      // Don't throw - tracking is non-critical
    }
  },

  /**
   * Track media download
   */
  async trackDownload(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/media/${id}/download`,
        {
          method: 'POST',
          headers: getHeaders()
        }
      );
      
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to track download:', error);
      // Don't throw - tracking is non-critical
    }
  },

  /**
   * Get public media (no auth required)
   */
  async getPublic(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.type) queryParams.append('type', params.type);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const response = await fetch(
      `${API_BASE_URL}/media/public?${queryParams}`
    );
    
    return handleResponse(response);
  }
};

/**
 * Folder operations (if your backend supports them)
 */
export const folderApi = {
  /**
   * Create a new folder
   */
  async create(name, parentFolder = 'root') {
    const response = await fetch(
      `${API_BASE_URL}/folders`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, parent: parentFolder })
      }
    );
    
    return handleResponse(response);
  },

  /**
   * Get all folders
   */
  async getAll() {
    const response = await fetch(
      `${API_BASE_URL}/folders`,
      {
        headers: getHeaders()
      }
    );
    
    return handleResponse(response);
  },

  /**
   * Delete folder
   */
  async delete(id) {
    const response = await fetch(
      `${API_BASE_URL}/folders/${id}`,
      {
        method: 'DELETE',
        headers: getHeaders()
      }
    );
    
    return handleResponse(response);
  }
};

/**
 * Utility functions
 */
export const mediaUtils = {
  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Detect file type from filename
   */
  detectFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'];
    const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma'];
    const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv'];
    
    if (imageExts.includes(ext)) return 'image';
    if (videoExts.includes(ext)) return 'video';
    if (audioExts.includes(ext)) return 'audio';
    if (documentExts.includes(ext)) return 'document';
    
    return 'document';
  },

  /**
   * Validate file
   */
  validateFile(file, options = {}) {
    const {
      maxSize = 50 * 1024 * 1024, // 50MB default
      allowedTypes = ['image', 'video', 'audio', 'document']
    } = options;
    
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.formatFileSize(maxSize)}`
      };
    }
    
    // Check file type
    const fileType = this.detectFileType(file.name);
    if (!allowedTypes.includes(fileType)) {
      return {
        valid: false,
        error: `File type "${fileType}" is not allowed`
      };
    }
    
    return { valid: true };
  },

  /**
   * Create thumbnail from image
   */
  async createThumbnail(file, maxWidth = 300, maxHeight = 300) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.8);
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

export default mediaApi;