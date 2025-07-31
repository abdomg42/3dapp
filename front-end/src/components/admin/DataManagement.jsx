import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useCategoryStore } from '../../store/CategoryStore';
import { useFormatStore } from '../../store/FormatStore';
import { useLogicielStore } from '../../store/LogicielStore';
import Modal from '../Modal';

const TABS = [
  { key: 'category', label: 'Category' },
  { key: 'format', label: 'Format' },
  { key: 'logiciel', label: 'Logiciel' },
];

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('category');
  
  // Category modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Format modal states
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [isFormatEditModalOpen, setIsFormatEditModalOpen] = useState(false);
  const [isFormatDeleteModalOpen, setIsFormatDeleteModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  
  // Logiciel modal states
  const [isLogicielModalOpen, setIsLogicielModalOpen] = useState(false);
  const [isLogicielEditModalOpen, setIsLogicielEditModalOpen] = useState(false);
  const [isLogicielDeleteModalOpen, setIsLogicielDeleteModalOpen] = useState(false);
  const [selectedLogiciel, setSelectedLogiciel] = useState(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [formatForm, setFormatForm] = useState({ extension: '' });
  const [logicielForm, setLogicielForm] = useState({ name: '' });

  // Fetch from stores
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { formats, fetchFormats, addFormat, updateFormat, deleteFormat } = useFormatStore();
  const { logiciels, fetchLogiciels, addLogiciel, updateLogiciel, deleteLogiciel } = useLogicielStore();

  useEffect(() => {
    fetchCategories();
    fetchFormats();
    fetchLogiciels();
  }, [fetchCategories, fetchFormats, fetchLogiciels]);

  // Pre-fill Category form on edit
  useEffect(() => {
    if (isCategoryEditModalOpen && selectedCategory) {
      setCategoryForm({ name: selectedCategory.name || '' });
    } else if (isCategoryModalOpen) {
      setCategoryForm({ name: '' });
    }
  }, [isCategoryEditModalOpen, isCategoryModalOpen, selectedCategory]);

  // Pre-fill Format form on edit
  useEffect(() => {
    if (isFormatEditModalOpen && selectedFormat) {
      setFormatForm({ extension: selectedFormat.extension || '' });
    } else if (isFormatModalOpen) {
      setFormatForm({ extension: '' });
    }
  }, [isFormatEditModalOpen, isFormatModalOpen, selectedFormat]);

  // Pre-fill Logiciel form on edit
  useEffect(() => {
    if (isLogicielEditModalOpen && selectedLogiciel) {
      setLogicielForm({ name: selectedLogiciel.name || '' });
    } else if (isLogicielModalOpen) {
      setLogicielForm({ name: '' });
    }
  }, [isLogicielEditModalOpen, isLogicielModalOpen, selectedLogiciel]);

  // Handlers for Category
  const handleCategoryFormChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    await addCategory(categoryForm);
    setIsCategoryModalOpen(false);
    setCategoryForm({ name: '' });
    fetchCategories();
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    await updateCategory(selectedCategory.id, categoryForm);
    setIsCategoryEditModalOpen(false);
    setSelectedCategory(null);
    setCategoryForm({ name: '' });
    fetchCategories();
  };
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    await deleteCategory(selectedCategory.id);
    setIsCategoryDeleteModalOpen(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  // Handlers for Format
  const handleFormatFormChange = (e) => {
    setFormatForm({ ...formatForm, [e.target.name]: e.target.value });
  };
  const handleAddFormat = async (e) => {
    e.preventDefault();
    await addFormat(formatForm);
    setIsFormatModalOpen(false);
    setFormatForm({ extension: '' });
    fetchFormats();
  };
  const handleUpdateFormat = async (e) => {
    e.preventDefault();
    if (!selectedFormat) return;
    await updateFormat(selectedFormat.id, formatForm);
    setIsFormatEditModalOpen(false);
    setSelectedFormat(null);
    setFormatForm({ extension: '' });
    fetchFormats();
  };
  const handleDeleteFormat = async () => {
    if (!selectedFormat) return;
    await deleteFormat(selectedFormat.id);
    setIsFormatDeleteModalOpen(false);
    setSelectedFormat(null);
    fetchFormats();
  };

  // Handlers for Logiciel
  const handleLogicielFormChange = (e) => {
    setLogicielForm({ ...logicielForm, [e.target.name]: e.target.value });
  };
  const handleAddLogiciel = async (e) => {
    e.preventDefault();
    await addLogiciel(logicielForm);
    setIsLogicielModalOpen(false);
    setLogicielForm({ name: '' });
    fetchLogiciels();
  };
  const handleUpdateLogiciel = async (e) => {
    e.preventDefault();
    if (!selectedLogiciel) return;
    await updateLogiciel(selectedLogiciel.id, logicielForm);
    setIsLogicielEditModalOpen(false);
    setSelectedLogiciel(null);
    setLogicielForm({ name: '' });
    fetchLogiciels();
  };
  const handleDeleteLogiciel = async () => {
    if (!selectedLogiciel) return;
    await deleteLogiciel(selectedLogiciel.id);
    setIsLogicielDeleteModalOpen(false);
    setSelectedLogiciel(null);
    fetchLogiciels();
  };

  // Get current data and handlers based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'category':
        return {
          data: categories,
          label: 'Category',
          addModal: isCategoryModalOpen,
          setAddModal: setIsCategoryModalOpen,
          editModal: isCategoryEditModalOpen,
          setEditModal: setIsCategoryEditModalOpen,
          deleteModal: isCategoryDeleteModalOpen,
          setDeleteModal: setIsCategoryDeleteModalOpen,
          selected: selectedCategory,
          setSelected: setSelectedCategory,
          form: categoryForm,
          setForm: setCategoryForm,
          handleAdd: handleAddCategory,
          handleUpdate: handleUpdateCategory,
          handleDelete: handleDeleteCategory,
          handleFormChange: handleCategoryFormChange,
          formField: 'name',
          formLabel: 'Name'
        };
      case 'format':
        return {
          data: formats,
          label: 'Format',
          addModal: isFormatModalOpen,
          setAddModal: setIsFormatModalOpen,
          editModal: isFormatEditModalOpen,
          setEditModal: setIsFormatEditModalOpen,
          deleteModal: isFormatDeleteModalOpen,
          setDeleteModal: setIsFormatDeleteModalOpen,
          selected: selectedFormat,
          setSelected: setSelectedFormat,
          form: formatForm,
          setForm: setFormatForm,
          handleAdd: handleAddFormat,
          handleUpdate: handleUpdateFormat,
          handleDelete: handleDeleteFormat,
          handleFormChange: handleFormatFormChange,
          formField: 'extension',
          formLabel: 'Extension'
        };
      case 'logiciel':
        return {
          data: logiciels,
          label: 'Logiciel',
          addModal: isLogicielModalOpen,
          setAddModal: setIsLogicielModalOpen,
          editModal: isLogicielEditModalOpen,
          setEditModal: setIsLogicielEditModalOpen,
          deleteModal: isLogicielDeleteModalOpen,
          setDeleteModal: setIsLogicielDeleteModalOpen,
          selected: selectedLogiciel,
          setSelected: setSelectedLogiciel,
          form: logicielForm,
          setForm: setLogicielForm,
          handleAdd: handleAddLogiciel,
          handleUpdate: handleUpdateLogiciel,
          handleDelete: handleDeleteLogiciel,
          handleFormChange: handleLogicielFormChange,
          formField: 'name',
          formLabel: 'Name'
        };
      default:
        return null;
    }
  };

  const currentData = getCurrentData();

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer px-5 py-2 rounded-md font-semibold border transition-colors ${
              activeTab === tab.key
                ? 'bg-[#444] text-white border-[#444]'
                : 'bg-white text-[#7A6B3F] border-[#ccc] hover:bg-[#f3f3f3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button 
          className="cursor-pointer ml-auto bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2"
          onClick={() => currentData?.setAddModal(true)}
        >
          <Plus size={18} /> Add
        </button>
      </div>
      <div className="bg-[#fafafa] rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 font-semibold text-base">
              <th className="py-2 px-2 w-12">Id</th>
              <th className="py-2 px-2">{currentData?.label}</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {currentData?.data && currentData.data.map((item, idx) => (
              <tr key={item.id || idx} className="text-gray-600 border-t border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-2">{item.id}</td>
                <td className="py-2 px-2">{item.name || item.extension}</td>
                <td className="py-2 px-2 flex gap-2">
                  <button 
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => { 
                      currentData.setSelected(item); 
                      currentData.setEditModal(true); 
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => { 
                      currentData.setSelected(item); 
                      currentData.setDeleteModal(true); 
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dynamic Modals for Category/Format/Logiciel */}
      {currentData && (
        <>
          {/* Add Modal */}
          <Modal
            isOpen={currentData.addModal}
            onClose={() => currentData.setAddModal(false)}
            title={`Add ${currentData.label}`}
          >
            <form onSubmit={currentData.handleAdd} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{currentData.formLabel} *</label>
                <input 
                  name={currentData.formField} 
                  value={currentData.form[currentData.formField]} 
                  onChange={currentData.handleFormChange} 
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <button type="submit" className="w-full cursor-pointer bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Add</button>
            </form>
          </Modal>

          {/* Edit Modal */}
          <Modal
            isOpen={currentData.editModal}
            onClose={() => currentData.setEditModal(false)}
            title={`Update ${currentData.label}`}
          >
            <form onSubmit={currentData.handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{currentData.formLabel} *</label>
                <input 
                  name={currentData.formField} 
                  value={currentData.form[currentData.formField]} 
                  onChange={currentData.handleFormChange} 
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <button type="submit" className="w-full cursor-pointer bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Update</button>
            </form>
          </Modal>

          {/* Delete Modal */}
          <Modal
            isOpen={currentData.deleteModal}
            onClose={() => currentData.setDeleteModal(false)}
            title={`Delete ${currentData.label}`}
          >
            <div className="text-center text-amber-700 py-8">
              Are you sure you want to delete {currentData.label.toLowerCase()}: <b>{currentData.selected?.[currentData.formField]}</b>?
              <div className="flex justify-center gap-4 mt-6">
                <button className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600" onClick={currentData.handleDelete}>Delete</button>
                <button className="bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={() => currentData.setDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default DataManagement; 