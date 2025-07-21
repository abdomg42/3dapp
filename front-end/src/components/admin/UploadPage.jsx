import React, { useState } from 'react';

const categories = ['Category 1', 'Category 2', 'Category 3'];
const formats = ['format 1', 'format 2', 'format 3'];
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

  const handleModelFile = (e) => setModelFile(e.target.files[0]);
  const handlePreviewFile = (e) => setPreviewFile(e.target.files[0]);
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
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
    <form className="max-w-xl mx-auto mt-8 pb-10 space-y-4 font-[Poppins]" style={{ fontFamily: "'Poppins', sans-serif" }} onSubmit={handleUpload}>
      <div>
        <label className="block mb-1 text-[#333]">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-2 py-1 bg-[#fff] text-black" />
      </div>
      <div className="flex gap-2">
        <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-2 py-1 bg-[#fff] text-black">
          <option value="">Category</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={format} onChange={e => setFormat(e.target.value)} className="border rounded px-2 py-1 bg-[#fff] text-black">
          <option value="">format</option>
          {formats.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-[#333]">Model file</label>
        <div className="flex">
          <input readOnly value={modelFile ? modelFile.name : ''} className="flex-1 border rounded-l px-2 py-1 bg-[#fff] text-black" />
          <label className="bg-[#444] text-white px-6 py-1 rounded-r cursor-pointer font-bold" style={{display:'flex',alignItems:'center'}}>
            Upload
            <input type="file" className="hidden" onChange={handleModelFile} />
          </label>
        </div>
      </div>
      <div>
        <select value={logiciel} onChange={e => setLogiciel(e.target.value)} className="border rounded px-2 py-1 bg-[#fff] text-black">
          <option value="">Logiciel</option>
          {logiciels.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-[#333]">Preview</label>
        <div className="flex">
          <input readOnly value={previewFile ? previewFile.name : ''} className="flex-1 border rounded-l px-2 py-1 bg-[#fff] text-black" />
          <label className="bg-[#444] text-white px-6 py-1 rounded-r cursor-pointer font-bold" style={{display:'flex',alignItems:'center'}}>
            Upload
            <input type="file" className="hidden" onChange={handlePreviewFile} />
          </label>
        </div>
      </div>
      <div>
        <label className="block mb-1 text-[#333]">Dimensions (en cm)</label>
        <div className="flex gap-2">
          <input value={length} onChange={e => setLength(e.target.value)} placeholder="Length" className="border rounded px-2 py-1 bg-[#fff] text-black w-1/3" />
          <input value={width} onChange={e => setWidth(e.target.value)} placeholder="Width" className="border rounded px-2 py-1 bg-[#fff] text-black w-1/3" />
          <input value={height} onChange={e => setHeight(e.target.value)} placeholder="Height" className="border rounded px-2 py-1 bg-[#fff] text-black w-1/3" />
        </div>
      </div>
      <div>
        <label className="block mb-1 text-[#333]">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-2 py-1 bg-[#fff] text-black min-h-[100px]" />
      </div>
      <div>
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
      </div>
      <div className="flex gap-4 mt-4">
        <button type="button" onClick={handleCancel} className="flex items-center gap-2 bg-[#444] text-white px-6 py-2 rounded font-bold">
          <span role="img" aria-label="cancel">🗑️</span> Cancel
        </button>
        <button type="submit" className="flex items-center gap-2 bg-[#2563eb] text-white px-6 py-2 rounded font-bold">
          <span role="img" aria-label="upload">📤</span> Upload
        </button>
      </div>
    </form>
  );
};

export default UploadPage;