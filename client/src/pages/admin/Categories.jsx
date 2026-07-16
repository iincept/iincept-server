import { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  Loader2, 
  AlertCircle, 
  FolderPlus 
} from 'lucide-react';
import { getCategories, createCategory, deleteCategory } from '../../services/categoryApi';
import axiosClient from '../../services/axiosClient';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Category form data
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  // Uploading status
  const [uploadingCatImage, setUploadingCatImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const catData = await getCategories();
      setCategories(catData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCatImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setCategoryForm(prev => ({
        ...prev,
        image: response.data.url
      }));
      showSuccessMessage('Category icon uploaded!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Category image upload failed');
    } finally {
      setUploadingCatImage(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.image) {
      setError('Category image is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createCategory(categoryForm);
      showSuccessMessage('Category created successfully!');
      resetCategoryForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Category creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? (This might fail if there are dependent products)')) return;
    setLoading(true);
    try {
      await deleteCategory(id);
      showSuccessMessage('Category deleted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      image: ''
    });
    setShowCategoryForm(false);
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div>
      {/* Alert toast notification */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-805 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {/* Global error banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm text-left">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Operation Error</p>
            <p className="text-rose-600 mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!showCategoryForm ? (
        <div>
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 text-left">
            <div>
              <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">Manage Categories</h1>
              <p className="text-zinc-500 mt-1 text-sm">Add groupings for iPhone, Mac, Watch, AirPods, etc.</p>
            </div>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer border-0"
            >
              <FolderPlus className="h-4.5 w-4.5" />
              Add Category
            </button>
          </header>

          {/* Categories Table List */}
          <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm overflow-hidden text-left">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-zinc-400">
                <Loader2 className="h-8 w-8 animate-spin text-[#0071e3] mb-3" />
                <span className="text-sm">Fetching categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center text-zinc-400">
                <Tag className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                <span className="text-sm">No categories found. Click "Add Category" to create one.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] tracking-widest font-extrabold border-b border-zinc-100">
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Slug</th>
                      <th className="py-4 px-6">Description</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                            {cat.image ? (
                              <img src={cat.image} alt="" className="object-cover h-full w-full" />
                            ) : (
                              <Tag className="h-4 w-4 text-zinc-400" />
                            )}
                          </div>
                          <span className="font-semibold text-zinc-900">{cat.name}</span>
                        </td>
                        <td className="py-4 px-6 text-zinc-500 font-medium font-mono text-xs">
                          {cat.slug}
                        </td>
                        <td className="py-4 px-6 text-zinc-500 text-xs max-w-xs truncate">
                          {cat.description || 'No description provided'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleCategoryDelete(cat._id)}
                            className="p-2 rounded-xl hover:bg-rose-50 text-zinc-500 hover:text-rose-600 transition-all cursor-pointer inline-block border-0 bg-transparent"
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Add Category Form UI
        <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm p-8 text-left max-w-2xl mx-auto animate-in fade-in duration-200">
          <header className="flex items-center justify-between border-b border-zinc-100 pb-5 mb-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-zinc-900">Add New Category</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Define a group tag for your products.</p>
            </div>
            <button 
              onClick={resetCategoryForm}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer border-0 bg-transparent"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <form onSubmit={handleCategorySubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. iPad"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-purple-650 focus:ring-1 focus:ring-purple-650 outline-none text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                rows="3"
                placeholder="Enter a brief summary for items in this category..."
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-purple-650 focus:ring-1 focus:ring-purple-650 outline-none text-sm transition-all resize-none"
              />
            </div>

            {/* Category Image upload widget */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Category Icon/Image
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="border-2 border-dashed border-zinc-200 hover:border-purple-600 rounded-2xl p-6 transition-all relative flex flex-col items-center justify-center bg-zinc-50/50">
                  {uploadingCatImage ? (
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-650 mb-1" />
                      <span className="text-[10px] font-semibold">Uploading...</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="h-5 w-5 text-zinc-400 mb-1" />
                      <span className="text-[11px] font-bold text-zinc-700">Upload Category Pic</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleCategoryImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {categoryForm.image && (
                  <div className="relative aspect-video sm:aspect-square rounded-2xl bg-white border border-zinc-150 overflow-hidden flex items-center justify-center p-1.5 max-h-32">
                    <img src={categoryForm.image} alt="" className="object-cover h-full w-full rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setCategoryForm(prev => ({...prev, image: ''}))}
                      className="absolute top-1.5 right-1.5 h-5 w-5 bg-black/75 text-white rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-black border-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions buttons */}
            <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5 mt-8">
              <button
                type="button"
                onClick={resetCategoryForm}
                className="px-5 py-3 rounded-xl text-sm font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer bg-transparent text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingCatImage}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/60 text-white px-6 py-3 rounded-xl text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer border-0"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
