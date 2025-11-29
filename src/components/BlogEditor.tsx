import { useState, useEffect } from 'react';
import { BlogPost } from './Blog';
import { Trash2, Edit3, Plus, Image, MoveUp, MoveDown, X as XIcon } from 'lucide-react';

export function BlogEditor() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    excerpt: '',
    content: '',
    imageUrl: ''
  });
  const [links, setLinks] = useState<Array<{ title: string; url: string }>>([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [contentBlocks, setContentBlocks] = useState<Array<{ 
    type: 'text' | 'image'; 
    content: string;
    imageWidth?: string;
    imageAlign?: 'left' | 'center' | 'right';
  }>>([
    { type: 'text', content: '' }
  ]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkModalData, setLinkModalData] = useState({ blockIndex: -1, linkText: '', linkUrl: '' });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const saved = localStorage.getItem('blogPosts');
    if (saved) {
      setPosts(JSON.parse(saved));
    }
  };

  const savePosts = (updatedPosts: BlogPost[]) => {
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty content blocks
    const filteredBlocks = contentBlocks.filter(block => block.content.trim() !== '');
    
    if (editingPost) {
      const updatedPosts = posts.map(post =>
        post.id === editingPost.id
          ? { 
              ...editingPost, 
              ...formData, 
              links: links.length > 0 ? links : undefined,
              contentBlocks: filteredBlocks.length > 0 ? filteredBlocks : undefined
            }
          : post
      );
      savePosts(updatedPosts);
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...formData,
        links: links.length > 0 ? links : undefined,
        contentBlocks: filteredBlocks.length > 0 ? filteredBlocks : undefined
      };
      savePosts([newPost, ...posts]);
    }

    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      excerpt: '',
      content: '',
      imageUrl: ''
    });
    setLinks([]);
    setContentBlocks([{ type: 'text', content: '' }]);
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      date: post.date,
      category: post.category || '',
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl || ''
    });
    setLinks(post.links || []);
    // Load content blocks if they exist, otherwise create one from content
    if (post.contentBlocks && post.contentBlocks.length > 0) {
      setContentBlocks(post.contentBlocks);
    } else {
      setContentBlocks([{ type: 'text', content: post.content }]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== id);
      savePosts(updatedPosts);
    }
  };

  const handleCancel = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      excerpt: '',
      content: '',
      imageUrl: ''
    });
    setLinks([]);
    setContentBlocks([{ type: 'text', content: '' }]);
  };

  const addLink = () => {
    if (newLink.title && newLink.url) {
      setLinks([...links, newLink]);
      setNewLink({ title: '', url: '' });
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const addTextBlock = () => {
    setContentBlocks([...contentBlocks, { type: 'text', content: '' }]);
  };

  const addImageBlock = () => {
    setContentBlocks([...contentBlocks, { 
      type: 'image', 
      content: '', 
      imageWidth: '100%', 
      imageAlign: 'center' 
    }]);
  };

  const updateBlock = (index: number, content: string) => {
    const updated = [...contentBlocks];
    updated[index].content = content;
    setContentBlocks(updated);
  };

  const updateImageWidth = (index: number, width: string) => {
    const updated = [...contentBlocks];
    updated[index].imageWidth = width;
    setContentBlocks(updated);
  };

  const updateImageAlign = (index: number, align: 'left' | 'center' | 'right') => {
    const updated = [...contentBlocks];
    updated[index].imageAlign = align;
    setContentBlocks(updated);
  };

  const insertLink = (blockIndex: number) => {
    setLinkModalData({ blockIndex, linkText: '', linkUrl: '' });
    setShowLinkModal(true);
  };

  const confirmInsertLink = () => {
    if (linkModalData.linkText && linkModalData.linkUrl) {
      const updated = [...contentBlocks];
      const markdownLink = `[${linkModalData.linkText}](${linkModalData.linkUrl})`;
      updated[linkModalData.blockIndex].content += markdownLink;
      setContentBlocks(updated);
    }
    setShowLinkModal(false);
    setLinkModalData({ blockIndex: -1, linkText: '', linkUrl: '' });
  };

  const removeBlock = (index: number) => {
    if (contentBlocks.length > 1) {
      setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    }
  };

  const moveBlockUp = (index: number) => {
    if (index > 0) {
      const updated = [...contentBlocks];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      setContentBlocks(updated);
    }
  };

  const moveBlockDown = (index: number) => {
    if (index < contentBlocks.length - 1) {
      const updated = [...contentBlocks];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setContentBlocks(updated);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          {editingPost ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <h3 className="text-foreground">
            {editingPost ? 'Edit Insight' : 'Create New Insight'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="title" className="block text-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-foreground mb-2">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                placeholder="e.g., Private Equity"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-foreground mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground resize-none"
              rows={2}
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-foreground mb-2">
              Featured Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Content Blocks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-foreground">
                Content Blocks
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addTextBlock}
                  className="flex items-center gap-2 px-3 py-1.5 border border-border text-foreground rounded-lg hover:bg-secondary transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Text
                </button>
                <button
                  type="button"
                  onClick={addImageBlock}
                  className="flex items-center gap-2 px-3 py-1.5 border border-border text-foreground rounded-lg hover:bg-secondary transition-all text-sm"
                >
                  <Image className="w-4 h-4" />
                  Image
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {contentBlocks.map((block, index) => (
                <div key={index} className="border border-border rounded-xl p-4 bg-secondary/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {block.type === 'text' ? '📝 Text Block' : '🖼️ Image Block'}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlockUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlockDown(index)}
                        disabled={index === contentBlocks.length - 1}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        disabled={contentBlocks.length === 1}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Remove"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {block.type === 'text' ? (
                    <div className="space-y-3">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => insertLink(index)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-all"
                        >
                          🔗 Add Link
                        </button>
                      </div>
                      <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(index, e.target.value)}
                        className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground resize-none"
                        rows={6}
                        placeholder="Enter your text content here... Use [link text](url) for hyperlinks"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tip: Use [link text](url) syntax for hyperlinks
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={block.content}
                        onChange={(e) => updateBlock(index, e.target.value)}
                        className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                        placeholder="https://example.com/image.jpg"
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-foreground mb-2">Width</label>
                          <select
                            value={block.imageWidth || '100%'}
                            onChange={(e) => updateImageWidth(index, e.target.value)}
                            className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                          >
                            <option value="25%">Small (25%)</option>
                            <option value="50%">Medium (50%)</option>
                            <option value="75%">Large (75%)</option>
                            <option value="100%">Full Width</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-foreground mb-2">Alignment</label>
                          <select
                            value={block.imageAlign || 'center'}
                            onChange={(e) => updateImageAlign(index, e.target.value as 'left' | 'center' | 'right')}
                            className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>

                      {block.content && (
                        <div 
                          className={`rounded-xl overflow-hidden border border-border flex ${
                            block.imageAlign === 'left' ? 'justify-start' :
                            block.imageAlign === 'right' ? 'justify-end' :
                            'justify-center'
                          }`}
                        >
                          <img
                            src={block.content}
                            alt={`Preview ${index + 1}`}
                            className="h-auto"
                            style={{ 
                              width: block.imageWidth || '100%',
                              maxWidth: '100%'
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Links */}
          <div className="border-t border-border pt-5 space-y-4">
            <h4 className="text-foreground">Related Links (optional)</h4>
            
            {links.length > 0 && (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="text-foreground">{link.title}</p>
                      <p className="text-muted-foreground text-sm truncate max-w-xs">{link.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="Link title"
                className="px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              />
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://example.com"
                className="px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              />
            </div>
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-xl hover:bg-secondary transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-all"
            >
              {editingPost ? 'Update' : 'Create'}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {posts.length > 0 && (
        <div>
          <h3 className="text-foreground mb-4">Existing Insights</h3>
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-foreground truncate mb-1">{post.title}</h4>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{post.date}</span>
                    {post.category && (
                      <>
                        <span>•</span>
                        <span>{post.category}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 text-foreground hover:bg-background rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Link Insertion Modal */}
      {showLinkModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowLinkModal(false)}
        >
          <div 
            className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-foreground mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-foreground mb-2 text-sm">Link Text</label>
                <input
                  type="text"
                  value={linkModalData.linkText}
                  onChange={(e) => setLinkModalData({ ...linkModalData, linkText: e.target.value })}
                  className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                  placeholder="Click here"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-foreground mb-2 text-sm">URL</label>
                <input
                  type="url"
                  value={linkModalData.linkUrl}
                  onChange={(e) => setLinkModalData({ ...linkModalData, linkUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={confirmInsertLink}
                  className="flex-1 px-4 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-all"
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 px-4 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
