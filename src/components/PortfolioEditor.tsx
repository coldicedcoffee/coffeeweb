import { useState, useEffect } from 'react';
import { PortfolioItem } from './Portfolio';
import { Trash2, Edit3, Plus } from 'lucide-react';

export function PortfolioEditor() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    imageUrl: '',
    link: '',
    tags: '',
    showButton: false,
    buttonText: 'View Project'
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const saved = localStorage.getItem('portfolioItems');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  };

  const saveItems = (updatedItems: PortfolioItem[]) => {
    localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (editingItem) {
      const updatedItems = items.map(item =>
        item.id === editingItem.id
          ? {
              ...editingItem,
              title: formData.title,
              type: formData.type || undefined,
              description: formData.description,
              imageUrl: formData.imageUrl,
              link: formData.link || undefined,
              tags,
              showButton: formData.showButton,
              buttonText: formData.buttonText
            }
          : item
      );
      saveItems(updatedItems);
    } else {
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type || undefined,
        description: formData.description,
        imageUrl: formData.imageUrl,
        link: formData.link || undefined,
        tags,
        showButton: formData.showButton,
        buttonText: formData.buttonText
      };
      saveItems([...items, newItem]);
    }

    setFormData({
      title: '',
      type: '',
      description: '',
      imageUrl: '',
      link: '',
      tags: '',
      showButton: false,
      buttonText: 'View Project'
    });
    setEditingItem(null);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type || '',
      description: item.description,
      imageUrl: item.imageUrl,
      link: item.link || '',
      tags: item.tags.join(', '),
      showButton: item.showButton || false,
      buttonText: item.buttonText || 'View Project'
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      saveItems(updatedItems);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      type: '',
      description: '',
      imageUrl: '',
      link: '',
      tags: '',
      showButton: false,
      buttonText: 'View Project'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          {editingItem ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <h3 className="text-foreground">
            {editingItem ? 'Edit Work Item' : 'Add New Work Item'}
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
              <label htmlFor="type" className="block text-foreground mb-2">
                Type
              </label>
              <input
                type="text"
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                placeholder="e.g., Private Equity"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-foreground mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground resize-none"
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-foreground mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label htmlFor="link" className="block text-foreground mb-2">
              Project Link (optional)
            </label>
            <input
              type="url"
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-foreground mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
              placeholder="Strategy, M&A, Operations"
              required
            />
          </div>

          <div className="border-t border-border pt-5 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showButton"
                checked={formData.showButton}
                onChange={(e) => setFormData({ ...formData, showButton: e.target.checked })}
                className="w-5 h-5 rounded border-input text-foreground focus:ring-2 focus:ring-foreground/20"
              />
              <label htmlFor="showButton" className="text-foreground cursor-pointer">
                Show project button
              </label>
            </div>

            {formData.showButton && (
              <div>
                <label htmlFor="buttonText" className="block text-foreground mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground"
                  placeholder="View Project"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-all"
            >
              {editingItem ? 'Update' : 'Add'}
            </button>
            {editingItem && (
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

      {items.length > 0 && (
        <div>
          <h3 className="text-foreground mb-4">Existing Work Items</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-foreground truncate mb-1">{item.title}</h4>
                    <p className="text-muted-foreground truncate">{item.type || 'No type'}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-foreground hover:bg-background rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
    </div>
  );
}
