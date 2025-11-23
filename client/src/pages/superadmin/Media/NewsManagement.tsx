import React, { useState, useEffect } from 'react';
import { 
  Newspaper, Plus, Search, Filter, Calendar, Eye, Edit, Trash2, 
  Clock, User, TrendingUp, Share2, MessageCircle,
  ExternalLink, X, Save, Send, Upload, AlertCircle, Loader
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blog';

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  type: string;
  status: string;
  featured: boolean;
  featuredImage?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  tags: string[];
  author: {
    firstName: string;
    lastName: string;
  };
  views: number;
  comments: number;
  shares: number;
  createdAt: string;
  publishedAt?: string;
}

const NewsManagement = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);
  const [articles, setArticles] = useState<NewsPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingArticle, setEditingArticle] = useState<NewsPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    type: 'NEWS',
    categoryId: '',
    tags: [] as string[],
    status: 'DRAFT',
    featured: false,
    featuredImage: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const getAuthToken = () => localStorage.getItem('token');

  // Fetch articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const params: any = { type: 'NEWS' };
      
      if (activeTab !== 'all') {
        params.status = activeTab.toUpperCase();
      }
      if (selectedCategory !== 'all') {
        params.categoryId = selectedCategory;
      }

      const response = await axios.get(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      let postsData = [];
      if (response.data?.data?.posts && Array.isArray(response.data.data.posts)) {
        postsData = response.data.data.posts;
      } else if (Array.isArray(response.data?.data)) {
        postsData = response.data.data;
      }

      setArticles(postsData);
      setError('');
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.response?.data?.message || 'Failed to load articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/posts/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data?.data || null);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchStats();
  }, [activeTab, selectedCategory]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('files', file);
      formData.append('folder', 'news');

      const token = getAuthToken();
      const response = await axios.post('http://localhost:5000/api/media/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setImagePreview(response.data.data.url);
      setFormData(prev => ({ ...prev, featuredImage: response.data.data.url }));
      setImageUploading(false);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
      setImageUploading(false);
    }
  };

  // Handle add tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  // Handle remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle edit
  const handleEdit = (article: NewsPost) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      type: article.type,
      categoryId: article.categoryId || '',
      tags: article.tags || [],
      status: article.status,
      featured: article.featured,
      featuredImage: article.featuredImage || ''
    });
    if (article.featuredImage) {
      setImagePreview(article.featuredImage);
    }
    setShowNewArticleModal(true);
  };

  // Handle submit
  const handleSubmit = async (publishNow = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = getAuthToken();
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        featuredImage: formData.featuredImage || undefined,
        categoryId: formData.categoryId || undefined,
        tags: formData.tags,
        status: publishNow ? 'PUBLISHED' : formData.status,
        featured: formData.featured,
        type: formData.type
      };

      if (editingArticle) {
        // Update existing article
        await axios.put(`${API_URL}/posts/${editingArticle.id}`, postData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Article ${publishNow ? 'updated and published' : 'updated'} successfully!`);
      } else {
        // Create new article
        await axios.post(`${API_URL}/posts`, postData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Article ${publishNow ? 'published' : 'saved as draft'} successfully!`);
      }

      setShowNewArticleModal(false);
      resetForm();
      fetchArticles();
      fetchStats();
    } catch (err: any) {
      console.error('Error saving article:', err);
      setError(err.response?.data?.message || 'Failed to save article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchArticles();
      fetchStats();
      alert('Article deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting article:', err);
      alert(err.response?.data?.message || 'Failed to delete article');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      type: 'NEWS',
      categoryId: '',
      tags: [],
      status: 'DRAFT',
      featured: false,
      featuredImage: ''
    });
    setImagePreview('');
    setTagInput('');
    setError('');
    setEditingArticle(null);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800 border-green-300';
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statsData = stats ? [
    { label: 'Total Articles', value: stats.total?.toString() || '0', change: '+12%', icon: Newspaper },
    { label: 'Total Views', value: stats.totalViews?.toLocaleString() || '0', change: '+23%', icon: Eye },
    { label: 'Engagement Rate', value: `${stats.engagementRate || 0}%`, change: '+5%', icon: TrendingUp },
    { label: 'Shares', value: stats.totalShares?.toLocaleString() || '0', change: '+18%', icon: Share2 }
  ] : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
            <p className="text-gray-600 mt-1">Create, manage and publish news articles</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowNewArticleModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Article
          </button>
        </div>

        {/* Stats */}
        {statsData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('published')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'published' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'draft' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                {article.featuredImage ? (
                  <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <Newspaper className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                {article.featured && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(article.status)}`}>
                    {article.status}
                  </span>
                  {article.category && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                      {article.category.name}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{article.author?.firstName} {article.author?.lastName}</span>
                  </div>
                  {article.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {article.status === 'PUBLISHED' && (
                  <div className="flex items-center justify-between text-sm text-gray-600 pb-3 mb-3 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{article.comments || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>{article.shares || 0}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(article)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
          <Newspaper className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or create a new article</p>
          <button
            onClick={() => {
              resetForm();
              setShowNewArticleModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Article
          </button>
        </div>
      )}

      {/* New/Edit Article Modal */}
      {showNewArticleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-lg z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button
                onClick={() => {
                  setShowNewArticleModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter article title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief summary of the article"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your article content here..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="NEWS">News</option>
                      <option value="ARTICLE">Article</option>
                      <option value="BLOG">Blog</option>
                      <option value="ANNOUNCEMENT">Announcement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        <button
                          onClick={() => {
                            setImagePreview('');
                            setFormData({ ...formData, featuredImage: '' });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        {imageUploading ? (
                          <Loader className="w-12 h-12 text-blue-600 animate-spin mb-2" />
                        ) : (
                          <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm text-gray-600">
                          {imageUploading ? 'Uploading...' : 'Click to upload image'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Max size: 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={imageUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type and press Enter to add tags"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-blue-600"
                            type="button"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Featured Article</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowNewArticleModal(false);
                    resetForm();
                  }}
                  disabled={submitting}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting || !formData.title.trim() || !formData.content.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={submitting || !formData.title.trim() || !formData.content.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Publishing...' : (editingArticle ? 'Update & Publish' : 'Publish Now')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;