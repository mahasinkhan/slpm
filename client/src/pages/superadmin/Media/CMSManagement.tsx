import React, { useState, useEffect } from 'react';
import { 
  Newspaper, Plus, Search, Edit, Trash2, Eye, Upload,
  X, Save, Loader2, Image, Video, FileText, Grid, List,
  Check, Tag, Heart, MessageCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Define content type
type ContentType = 'news' | 'blog' | 'announcement' | 'event';

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  type: ContentType;
  category: string;
  tags: Array<{name: string}>;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  featuredImage?: string;
  publishedDate?: string;
  author: any;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  readTime?: string;
}

const CMSManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'media'>('content');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form state with proper typing
  const [formData, setFormData] = useState<{
    title: string;
    excerpt: string;
    content: string;
    type: ContentType;
    category: string;
    tags: string[];
    featured: boolean;
    publishNow: boolean;
  }>({
    title: '',
    excerpt: '',
    content: '',
    type: 'news',
    category: 'general',
    tags: [],
    featured: false,
    publishNow: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const categories = ['all', 'general', 'technology', 'business', 'education', 'health'];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContents(response.data.data.content || []);
    } catch (error: any) {
      toast.error('Failed to load content');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleSaveContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      if (imageFile) {
        formDataToSend.append('featuredImage', imageFile);
      }

      const url = editingContent 
        ? `${API_URL}/content/${editingContent.id}`
        : `${API_URL}/content`;
      
      const method = editingContent ? 'put' : 'post';

      await axios[method](url, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(`Content ${editingContent ? 'updated' : 'created'} successfully`);
      await fetchContents();
      handleCloseForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save content');
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Content deleted successfully');
      await fetchContents();
    } catch (error: any) {
      toast.error('Failed to delete content');
    }
  };

  const handlePublishContent = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/content/${id}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Content published successfully');
      await fetchContents();
    } catch (error: any) {
      toast.error('Failed to publish content');
    }
  };

  const handleOpenForm = (content?: ContentItem) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        title: content.title,
        excerpt: content.excerpt || '',
        content: content.content,
        type: content.type,
        category: content.category,
        tags: content.tags.map(t => t.name),
        featured: content.featured,
        publishNow: false
      });
      if (content.featuredImage) {
        setImagePreview(content.featuredImage);
      }
    }
    setShowContentForm(true);
  };

  const handleCloseForm = () => {
    setShowContentForm(false);
    setEditingContent(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      type: 'news',
      category: 'general',
      tags: [],
      featured: false,
      publishNow: false
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredContent = contents.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">Manage news, blogs, and media</p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Content
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredContent.map((item) => (
          <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            {item.featuredImage && (
              <div className="relative h-48 bg-gray-200">
                <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" />
                {item.featured && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
                    Featured
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                  {item.type}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {item.views}
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    {item.likes}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleOpenForm(item)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                {item.status === 'draft' && (
                  <button
                    onClick={() => handlePublishContent(item.id)}
                    className="flex items-center justify-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteContent(item.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Form Modal */}
      {showContentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-4xl w-full shadow-xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingContent ? 'Edit Content' : 'Create New Content'}
                </h2>
                <button onClick={handleCloseForm} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content title..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentType })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="news">News</option>
                      <option value="blog">Blog</option>
                      <option value="announcement">Announcement</option>
                      <option value="event">Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Brief summary..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    placeholder="Write your content here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => { setImagePreview(null); setImageFile(null); }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <Image className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                        {tag}
                        <button type="button" onClick={() => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })} className="hover:text-blue-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.publishNow}
                      onChange={(e) => setFormData({ ...formData, publishNow: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Publish Now</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  onClick={handleCloseForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContent}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingContent ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSManagement;