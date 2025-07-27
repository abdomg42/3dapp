import React, { useState } from 'react';
import { useProductStore } from '../../store/ProductStore';

const categories = ['Cat1', 'Category 2', 'Category 3'];
const formats = ['format 1', 'format 2', '.xml'];
const logiciels = ['Logiciel 1', 'Logiciel 2', 'Logiciel 3'];

const UploadPage = () => {

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [format, setFormat] = useState('');
  const [modelFile, setModelFile] = useState(null);
  const [logiciel, setLogiciel] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const {addProduct, formData, setFormData } = useProductStore();


  const handleCancel = () => {
    setTitle(''); setCategory(''); setFormat(''); setModelFile(null); setLogiciel(''); setPreviewFile(null);
    setLength(''); setWidth(''); setHeight(''); setDescription(''); setTagInput(''); setTags([]);
  };
  const handleUpload = (e) => {
    e.preventDefault();
    // handle upload logic here
    alert('Upload submitted!');
  };

  return (
    <form className="max-w-xl mx-auto mt-8 pb-10 space-y-4 font-[Poppins]" style={{ fontFamily: "'Poppins', sans-serif" }} onSubmit={addProduct}>
      <div>
        <label className="block mb-1 text-[#333]">Title</label>
        <input value={formData.name} onChange={e => setFormData({...formData , name : e.target.value})} className="w-full border rounded px-2 py-1 bg-[#fff] text-black" />
      </div>
      <div className="flex gap-2">
        <select value={formData.category} onChange={e => setFormData({...formData , category : e.target.value})} className="border rounded px-2 py-1 bg-[#fff] text-black">
          <option value="">Category</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={formData.format} onChange={e => setFormData({...formData , format : e.target.value})} className="border rounded px-2 py-1 bg-[#fff] text-black">
          <option value="">format</option>
          {formats.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-[#333]">Model path </label>
        <div className="flex">
          <input type="text"  value={formData.fichier_path} className="flex-1 border rounded-l px-2 py-1 bg-[#fff] text-black" onChange={e => setFormData({...formData , fichier_path : e.target.value})} />
          <label className="bg-[#444] text-white px-6 py-1 rounded-r cursor-pointer font-bold" style={{display:'flex',alignItems:'center'}}>
            Upload
            <input type="file" className="hidden"  />
          </label>
        </div>
      </div>
      <div>
        <select value={formData.logiciel} onChange={e =>  setFormData({...formData , logiciel : e.target.value})} className="border rounded px-2 py-1 bg-[#fff] text-black">
          <option value="">Logiciel</option>
          {logiciels.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-[#333]">Image </label>
        <div className="flex">
           <input type="text"  value={formData.image} className="flex-1 border rounded-l px-2 py-1 bg-[#fff] text-black" onChange={e => setFormData({...formData , image : e.target.value})} />
          <label className="bg-[#444] text-white px-6 py-1 rounded-r cursor-pointer font-bold" style={{display:'flex',alignItems:'center'}}>
            Upload
            <input type="file" className="hidden"  />
          </label>
        </div>
      </div>
      <div>
        <label className="block mb-1 text-[#333]">Description</label>
        <textarea value={formData.description} onChange={e => setFormData({...formData , description : e.target.value})} className="w-full border rounded px-2 py-1 bg-[#fff] text-black min-h-[100px]" />
      </div>
      {/* <div>
        <label className="block mb-1 text-[#333]">Tags</label>
        <div className="flex">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} className="flex-1 border rounded-l px-2 py-1 bg-[#fff] text-black" />
          <button onClick={handleAddTag} className="bg-[#444] text-white px-6 py-1 rounded-r font-bold">Add</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="bg-[#E0E0E0] px-3 py-1 rounded-full text-sm">{tag}</span>
          ))}
        </div>
      </div> */}
      <div className="flex gap-4 mt-4">
        <button type="reset" onClick={handleCancel} className="flex items-center gap-2 bg-[#444] text-white px-6 py-2 rounded font-bold cursor-pointer">
          <span role="img" aria-label="cancel">🗑️</span> Cancel
        </button>
        <button type="submit" className="flex items-center gap-2 bg-[#2563eb] text-white px-6 py-2 rounded font-bold cursor-pointer">
          <span role="img" aria-label="upload">📤</span> Upload
        </button>
      </div>
    </form>
  );
};

export default UploadPage;