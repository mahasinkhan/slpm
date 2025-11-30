import React, { useState, useRef, useEffect } from 'react';
import { 
  Image, Video, FileText, Music, Upload, Search, Filter, Grid, List,
  Download, Trash2, Edit2, Share2, Eye, MoreVertical, Folder, 
  FolderPlus, ChevronRight, X, Check, Copy, Link, Info, Calendar,
  HardDrive, File, FileVideo, FileAudio, FileImage, AlertCircle, CheckCircle,
  Loader
} from 'lucide-react';

// Option 1: Import from config file (recommended)
// import { API_BASE_URL } from '../config/config';

// Option 2: Direct configuration (simple, works everywhere)
const API_BASE_URL = 'http://localhost:5000/api'; // â† UPDATE THIS WITH YOUR BACKEND URL

const MediaLibrary = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalFiles: 0,
    storageUsed: '0 GB',
    images: 0,
    videos: 0,
    documents: 0,
    audio: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    folder: 'root',
    public: false,
    tags: ''
  });

  const fileTypes = ['All', 'Images', 'Videos', 'Documents', 'Audio', 'Folders'];

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fetch media from API
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      if (selectedType !== 'all') {
        params.append('type', selectedType.slice(0, -1)); // Remove 's' from plural
      }
      if (currentFolder !== 'root') {
        params.append('folder', currentFolder);
      }

      const response = await fetch(`${API_BASE_URL}/media?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      
      if (data.success) {
        setMediaItems(data.data.media || []);
        setPagination(data.data.pagination || pagination);
        calculateStats(data.data.media || []);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      showNotification('Failed to load media. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (media) => {
    const stats = {
      totalFiles: media.filter(item => item.type !== 'folder').length,
      storageUsed: '24.5 GB', // This should come from backend
      images: media.filter(item => item.type === 'image').length,
      videos: media.filter(item => item.type === 'video').length,
      documents: media.filter(item => item.type === 'document').length,
      audio: media.filter(item => item.type === 'audio').length
    };
    setStats(stats);
  };

  // Load media on component mount and when filters change
  useEffect(() => {
    fetchMedia();
  }, [pagination.page, selectedType, currentFolder]);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Get file icon
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return FileImage;
      case 'video': return FileVideo;
      case 'audio': return FileAudio;
      case 'document': return FileText;
      case 'folder': return Folder;
      default: return File;
    }
  };

  // Get file color
  const getFileColor = (type) => {
    switch (type) {
      case 'image': return 'text-blue-500';
      case 'video': return 'text-green-500';
      case 'audio': return 'text-purple-500';
      case 'document': return 'text-orange-500';
      case 'folder': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  // Handle files upload
  const handleFiles = async (files) => {
    const token = getAuthToken();
    if (!token) {
      showNotification('Please login to upload files', 'error');
      return;
    }

    const newUploadingFiles = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: detectFileType(file.name),
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload files
    for (const uploadFile of newUploadingFiles) {
      await uploadFile_API(uploadFile);
    }

    // Close modal and refresh
    setShowUploadModal(false);
    fetchMedia();
  };

  // Upload file to API
  const uploadFile_API = async (uploadFile) => {
    const token = getAuthToken();
    const formData = new FormData();
    
    formData.append('files', uploadFile.file);
    formData.append('folder', currentFolder);
    formData.append('title', uploadFile.file.name);
    formData.append('public', 'false');

    console.log('Uploading to:', `${API_BASE_URL}/media/upload`);
    console.log('File:', uploadFile.file.name, 'Size:', uploadFile.size);
    console.log('Token present:', !!token);

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadingFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id ? { ...f, progress } : f
            )
          );
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        console.log('Upload response status:', xhr.status);
        console.log('Upload response:', xhr.responseText);
        
        if (xhr.status === 201 || xhr.status === 200) {
          setUploadingFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'completed', progress: 100 }
                : f
            )
          );

          showNotification(`${uploadFile.name} uploaded successfully!`);

          // Remove from uploading list after delay
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.id !== uploadFile.id));
          }, 2000);
        } else {
          // Get error message from response
          let errorMessage = 'Upload failed';
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = `Upload failed with status ${xhr.status}`;
          }
          
          console.error('Upload error:', errorMessage);
          setUploadingFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'error', progress: 0 }
                : f
            )
          );
          showNotification(`Failed to upload ${uploadFile.name}: ${errorMessage}`, 'error');
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: 'error', progress: 0 }
              : f
          )
        );
        showNotification(`Failed to upload ${uploadFile.name}`, 'error');
      });

      xhr.open('POST', `${API_BASE_URL}/media/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', progress: 0 }
            : f
        )
      );
      showNotification(`Failed to upload ${uploadFile.name}`, 'error');
    }
  };

  // Detect file type from extension
  const detectFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) return 'audio';
    return 'document';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      showNotification('Please enter a folder name', 'error');
      return;
    }

    // For now, create a folder entry locally
    const newFolder = {
      id: Date.now().toString(),
      title: newFolderName,
      type: 'folder',
      folder: currentFolder,
      uploadedBy: { firstName: 'Current', lastName: 'User' },
      createdAt: new Date().toISOString(),
      size: '0 KB'
    };

    setMediaItems(prev => [...prev, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
    showNotification(`Folder "${newFolderName}" created successfully!`);
  };

  // Delete media
  const handleDelete = async (itemIds) => {
    const token = getAuthToken();
    if (!token) {
      showNotification('Please login to delete files', 'error');
      return;
    }

    const itemsToDelete = Array.isArray(itemIds) ? itemIds : [itemIds];
    
    try {
      for (const itemId of itemsToDelete) {
        const response = await fetch(`${API_BASE_URL}/media/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete media');
        }
      }

      showNotification(`${itemsToDelete.length} item(s) deleted successfully!`);
      setSelectedItems([]);
      fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      showNotification('Failed to delete media. Please try again.', 'error');
    }
  };

  // Download file
  const handleDownload = async (item) => {
    const token = getAuthToken();
    
    try {
      // Track download
      await fetch(`${API_BASE_URL}/media/${item.id}/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification(`Downloading ${item.title}...`);
    } catch (error) {
      console.error('Error downloading:', error);
      showNotification('Failed to download file', 'error');
    }
  };

  // Share file
  const handleShare = (item) => {
    const shareUrl = `${window.location.origin}/media/${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification(`Share link copied for ${item.title}!`);
  };

  // Copy link
  const handleCopyLink = (item) => {
    navigator.clipboard.writeText(item.url);
    showNotification('Link copied to clipboard!');
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditForm({
      title: item.title,
      description: item.description || '',
      folder: item.folder || 'root',
      public: item.public || false,
      tags: item.tags?.map(t => t.name).join(', ') || ''
    });
    setShowPreview(item);
    setShowEditModal(true);
  };

  // Update media
  const handleUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      showNotification('Please login to update files', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/media/${showPreview.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          folder: editForm.folder,
          public: editForm.public,
          tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update media');
      }

      showNotification('Media updated successfully!');
      setShowEditModal(false);
      setShowPreview(null);
      fetchMedia();
    } catch (error) {
      console.error('Error updating media:', error);
      showNotification('Failed to update media. Please try again.', 'error');
    }
  };

  // Track view
  const handleView = async (item) => {
    const token = getAuthToken();
    
    try {
      await fetch(`${API_BASE_URL}/media/${item.id}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
    
    setShowPreview(item);
  };

  // Filter items
  const filteredItems = mediaItems.filter(item => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Handle item selection
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Select all items
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  // Open folder
  const handleOpenFolder = (folderName) => {
    setCurrentFolder(folderName);
    setSelectedItems([]);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get uploader name
  const getUploaderName = (item) => {
    if (item.uploadedBy) {
      if (typeof item.uploadedBy === 'string') {
        return item.uploadedBy;
      }
      return `${item.uploadedBy.firstName} ${item.uploadedBy.lastName}`;
    }
    return 'Unknown';
  };

  const statsData = [
    { 
      label: 'Total Files', 
      value: stats.totalFiles.toString(), 
      icon: File, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Storage Used', 
      value: stats.storageUsed, 
      icon: HardDrive, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Images', 
      value: stats.images.toString(), 
      icon: Image, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Videos', 
      value: stats.videos.toString(), 
      icon: Video, 
      color: 'bg-orange-500' 
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600 mt-1">Manage all your media assets in one place</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowNewFolderModal(true)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              New Folder
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Files
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value.toLowerCase())}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fileTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedItems.length} selected
                </span>
                <button 
                  onClick={() => selectedItems.forEach(id => {
                    const item = mediaItems.find(m => m.id === id);
                    if (item) handleDownload(item);
                  })}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  title="Download selected"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => selectedItems.forEach(id => {
                    const item = mediaItems.find(m => m.id === id);
                    if (item) handleShare(item);
                  })}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  title="Share selected"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete ${selectedItems.length} item(s)?`)) {
                      handleDelete(selectedItems);
                    }
                  }}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  title="Delete selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mt-4 text-sm">
            <button 
              onClick={() => setCurrentFolder('root')}
              className="text-blue-600 hover:text-blue-700"
            >
              Media Library
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{currentFolder === 'root' ? 'All Files' : currentFolder}</span>
          </div>
        </div>
      </div>

      {/* Uploading Files Progress */}
      {uploadingFiles.length > 0 && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Uploading Files</h3>
          <div className="space-y-3">
            {uploadingFiles.map(file => (
              <div key={file.id} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getFileColor(file.type)} bg-opacity-10`}>
                  {React.createElement(getFileIcon(file.type), { 
                    className: `w-5 h-5 ${getFileColor(file.type)}` 
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    <span className="text-sm text-gray-600">
                      {file.status === 'error' ? 'Failed' : `${Math.round(file.progress)}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        file.status === 'completed' ? 'bg-green-500' : 
                        file.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
                {file.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Media Grid/List */}
      {!loading && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredItems.map((item) => {
                const Icon = getFileIcon(item.type);
                const isSelected = selectedItems.includes(item.id);
                
                return (
                  <div
                    key={item.id}
                    className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
                      isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'
                    }`}
                    onClick={() => {
                      if (item.type === 'folder') {
                        handleOpenFolder(item.title.toLowerCase().replace(/\s+/g, '-'));
                      } else {
                        handleView(item);
                      }
                    }}
                  >
                    {/* Selection Checkbox */}
                    <div
                      className="absolute top-2 left-2 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectItem(item.id);
                      }}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>

                    {/* More Options */}
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        className="p-1 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* File Preview */}
                    <div className="p-4">
                      <div className="flex justify-center mb-3">
                        {item.type === 'folder' ? (
                          <Folder className="w-16 h-16 text-yellow-500" />
                        ) : item.type === 'image' && item.url ? (
                          <img src={item.url} alt={item.title} className="w-full h-24 object-cover rounded" />
                        ) : item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-24 object-cover rounded" />
                        ) : (
                          <Icon className={`w-16 h-16 ${getFileColor(item.type)}`} />
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 truncate mb-1" title={item.title}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">{item.size}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Uploaded By</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => {
                    const Icon = getFileIcon(item.type);
                    const isSelected = selectedItems.includes(item.id);
                    
                    return (
                      <tr 
                        key={item.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          if (item.type === 'folder') {
                            handleOpenFolder(item.title.toLowerCase().replace(/\s+/g, '-'));
                          }
                        }}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectItem(item.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${getFileColor(item.type)}`} />
                            <span className="text-sm font-medium text-gray-900">{item.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{item.size}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{getUploaderName(item)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{formatDate(item.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.type !== 'folder') handleView(item);
                              }}
                              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item);
                              }}
                              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                              }}
                              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete ${item.title}?`)) {
                                  handleDelete(item.id);
                                }
                              }}
                              className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
          <Image className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600 mb-4">Upload your first file or adjust filters</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Files
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* File Preview Modal */}
      {showPreview && !showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{showPreview.title}</h2>
                <button
                  onClick={() => setShowPreview(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-6">
                {showPreview.type === 'image' && showPreview.url ? (
                  <img src={showPreview.url} alt={showPreview.title} className="max-w-full max-h-96 rounded-lg" />
                ) : showPreview.type === 'video' && showPreview.url ? (
                  <video controls className="max-w-full max-h-96 rounded-lg">
                    <source src={showPreview.url} />
                  </video>
                ) : showPreview.type === 'audio' && showPreview.url ? (
                  <audio controls className="w-full">
                    <source src={showPreview.url} />
                  </audio>
                ) : (
                  <div className="text-center">
                    {React.createElement(getFileIcon(showPreview.type), { 
                      className: `w-32 h-32 ${getFileColor(showPreview.type)} mx-auto mb-4` 
                    })}
                    <p className="text-gray-600">Preview not available for this file type</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Size:</span>
                  <span className="ml-2 text-gray-600">{showPreview.size}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600 capitalize">{showPreview.type}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Uploaded By:</span>
                  <span className="ml-2 text-gray-600">{getUploaderName(showPreview)}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span className="ml-2 text-gray-600">{formatDate(showPreview.createdAt)}</span>
                </div>
                {showPreview.dimensions && (
                  <div>
                    <span className="font-semibold text-gray-700">Dimensions:</span>
                    <span className="ml-2 text-gray-600">{showPreview.dimensions}</span>
                  </div>
                )}
                {showPreview.duration && (
                  <div>
                    <span className="font-semibold text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-600">{showPreview.duration}</span>
                  </div>
                )}
                {showPreview.views !== undefined && (
                  <div>
                    <span className="font-semibold text-gray-700">Views:</span>
                    <span className="ml-2 text-gray-600">{showPreview.views}</span>
                  </div>
                )}
                {showPreview.downloads !== undefined && (
                  <div>
                    <span className="font-semibold text-gray-700">Downloads:</span>
                    <span className="ml-2 text-gray-600">{showPreview.downloads}</span>
                  </div>
                )}
                {showPreview.description && (
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">Description:</span>
                    <p className="mt-1 text-gray-600">{showPreview.description}</p>
                  </div>
                )}
                {showPreview.tags && showPreview.tags.length > 0 && (
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {showPreview.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag.name || tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => handleDownload(showPreview)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button 
                  onClick={() => handleShare(showPreview)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button 
                  onClick={() => handleCopyLink(showPreview)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
                <button 
                  onClick={() => {
                    setShowPreview(null);
                    handleEdit(showPreview);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Media</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowPreview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder
                  </label>
                  <input
                    type="text"
                    value={editForm.folder}
                    onChange={(e) => setEditForm({ ...editForm, folder: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="public"
                    checked={editForm.public}
                    onChange={(e) => setEditForm({ ...editForm, public: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="public" className="ml-2 text-sm text-gray-700">
                    Make this media public
                  </label>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowPreview(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upload Files</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDragging ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragging ? 'Drop files here' : 'Drag and drop your files here'}
                </p>
                <p className="text-sm text-gray-600 mb-4">or</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Maximum file size: 50MB. Supported formats: Images, Videos, Audio, Documents
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Folder</h2>
                <button
                  onClick={() => {
                    setShowNewFolderModal(false);
                    setNewFolderName('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNewFolderModal(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;