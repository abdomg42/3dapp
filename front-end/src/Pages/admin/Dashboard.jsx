import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useUserAdminStore } from '../../store/UserAdminStore';
import { useCategoryStore } from '../../store/CategoryStore';
import { useProductStore } from '../../store/ProductStore';
import Modal from '../../components/Modal';

const TABS = [
  { key: 'category', label: 'Category' },
  { key: 'format', label: 'Format' },
  { key: 'logiciel', label: 'Logiciel' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('category');
  // User modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Category modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Logiciel modal states
  const [isLogicielModalOpen, setIsLogicielModalOpen] = useState(false);
  const [isLogicielEditModalOpen, setIsLogicielEditModalOpen] = useState(false);
  const [isLogicielDeleteModalOpen, setIsLogicielDeleteModalOpen] = useState(false);
  const [selectedLogiciel, setSelectedLogiciel] = useState(null);

  // User form state
  const [UserForm, setUserForm] = useState({ name: '', email: '', password: '', role: '' });
  // Category form state
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  // Logiciel form state
  const [logicielForm, setLogicielForm] = useState({ name: '' });

  // Fetch from stores
  const { Users, fetchUsers, addUser, updateUser, removeUser } = useUserAdminStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { formats, fetchFormats, logiciels, fetchLogiciels } = useProductStore();

  useEffect(() => {
    fetchUsers();
    fetchCategories();
    fetchFormats();
      fetchLogiciels();
  }, [fetchUsers,fetchFormats, fetchCategories, fetchLogiciels]);

  // Pre-fill User form on edit
  useEffect(() => {
    if (isUserEditModalOpen && selectedUser) {
      setUserForm({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        password: '',
        role: selectedUser.role || '',
      });
    } else if (isUserModalOpen) {
      setUserForm({ name: '', email: '', password: '', role: '' });
    }
  }, [isUserEditModalOpen, isUserModalOpen, selectedUser]);

  // Pre-fill Category form on edit
  useEffect(() => {
    if (isCategoryEditModalOpen && selectedCategory) {
      setCategoryForm({ name: selectedCategory.name || '' });
    } else if (isCategoryModalOpen) {
      setCategoryForm({ name: '' });
    }
  }, [isCategoryEditModalOpen, isCategoryModalOpen, selectedCategory]);

  // Pre-fill Logiciel form on edit
  useEffect(() => {
    if (isLogicielEditModalOpen && selectedLogiciel) {
      setLogicielForm({ name: selectedLogiciel.name || '' });
    } else if (isLogicielModalOpen) {
      setLogicielForm({ name: '' });
    }
  }, [isLogicielEditModalOpen, isLogicielModalOpen, selectedLogiciel]);

  // Handlers for User
  const handleUserFormChange = (e) => {
    setUserForm({ ...UserForm, [e.target.name]: e.target.value });
  };
  const handleAddUser = async (e) => {
    e.preventDefault();
    await addUser(UserForm);
    setIsUserModalOpen(false);
    setUserForm({ name: '', email: '', password: '', role: '' });
    fetchUsers();
  };
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    await updateUser(selectedUser.id, UserForm);
    setIsUserEditModalOpen(false);
    setSelectedUser(null);
    setUserForm({ name: '', email: '', password: '', role: '' });
    fetchUsers();
  };
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    await removeUser(selectedUser.id);
    setIsUserDeleteModalOpen(false);
    setSelectedUser(null);
    fetchUsers();
  };

  // Handlers for Category
  const handleCategoryFormChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    // You may need to use your store's addCategory logic here
    // For now, just close modal
    setIsCategoryModalOpen(false);
    setCategoryForm({ name: '' });
    fetchCategories();
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    // You may need to use your store's updateCategory logic here
    setIsCategoryEditModalOpen(false);
    setSelectedCategory(null);
    setCategoryForm({ name: '' });
    fetchCategories();
  };
  const handleDeleteCategory = async () => {
    // You may need to use your store's deleteCategory logic here
    setIsCategoryDeleteModalOpen(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  // Handlers for Logiciel
  const handleLogicielFormChange = (e) => {
    setLogicielForm({ ...logicielForm, [e.target.name]: e.target.value });
  };
  const handleAddLogiciel = async (e) => {
    e.preventDefault();
    // You may need to use your store's addLogiciel logic here
    setIsLogicielModalOpen(false);
    setLogicielForm({ name: '' });
    fetchLogiciels();
  };
  const handleUpdateLogiciel = async (e) => {
    e.preventDefault();
    // You may need to use your store's updateLogiciel logic here
    setIsLogicielEditModalOpen(false);
    setSelectedLogiciel(null);
    setLogicielForm({ name: '' });
    fetchLogiciels();
  };
  const handleDeleteLogiciel = async () => {
    // You may need to use your store's deleteLogiciel logic here
    setIsLogicielDeleteModalOpen(false);
    setSelectedLogiciel(null);
    fetchLogiciels();
  };

  // Select data for the active tab
  let tableData = categories;
  let tableLabel = 'Category';
  if (activeTab === 'format') {
    tableData = formats;
    tableLabel = 'Format';
  } else if (activeTab === 'logiciel') {
    tableData = logiciels;
    tableLabel = 'Logiciel';
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 font-[Poppins]">
      {/* Users Section */}
      <h2 className="text-3xl font-bold text-[#7A6B3F] mb-2">All User</h2>
        <div className="flex justify-end mb-2">
          <button
            className="cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2"
            onClick={() => setIsUserModalOpen(true)}
          >
            <Plus size={18} /> Add
          </button>
        </div>
      <div className="bg-[#fafafa] rounded-xl shadow p-6 mb-8">
        <table className="table ">
          <thead>
            <tr className="text-gray-500 font-semibold text-base ">
              <th className="py-2 px-2">Username</th>
              <th className="py-2 px-2">Email</th>
              <th className="py-2 px-2">role</th>
              <th className="py-2 px-2">Date of admission</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {Users && Users.map((user, idx) => (
              <tr key={user.id || idx} className="text-gray-600 border-t border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-2">{user.name}</td>
                <td className="py-2 px-2">{user.email}</td>
                <td className="py-2 px-2">{user.role}</td>
                <td className="py-2 px-2">{user.created_at }</td>
                <td className="py-2 px-2 flex gap-2">
                  <button
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => { setSelectedUser(user); setIsUserEditModalOpen(true); }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => { setSelectedUser(user); setIsUserDeleteModalOpen(true); }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          title="Add User"
        >
          <form onSubmit={handleAddUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input name="name" value={UserForm.name} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input name="email" type="email" value={UserForm.email} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input name="password" type="password" value={UserForm.password} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <input name="role" value={UserForm.role} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Add</button>
          </form>
        </Modal>
        <Modal
          isOpen={isUserEditModalOpen}
          onClose={() => setIsUserEditModalOpen(false)}
          title="Update User"
        >
          <form onSubmit={handleUpdateUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input name="name" value={UserForm.name} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input name="email" type="email" value={UserForm.email} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input name="password" type="password" value={UserForm.password} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <input name="role" value={UserForm.role} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Update</button>
          </form>
        </Modal>
        <Modal
          isOpen={isUserDeleteModalOpen}
          onClose={() => setIsUserDeleteModalOpen(false)}
          title="Delete User"
        >
          <div className="text-center text-amber-700 py-8">
            Are you sure you want to delete user: <b>{selectedUser?.name}</b>?
            <div className="flex justify-center gap-4 mt-6">
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDeleteUser}>Delete</button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={() => setIsUserDeleteModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Category/Format/Logiciel Section */}
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
        <button className=" cursor-pointer ml-auto bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2">
          <Plus size={18} /> Add
        </button>
      </div>
      <div className="bg-[#fafafa] rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 font-semibold text-base">
              <th className="py-2 px-2 w-12">Id</th>
              <th className="py-2 px-2">{tableLabel}</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {tableData && tableData.map((item, idx) => (
              <tr key={item.id || idx} className="text-gray-600 border-t border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-2">{item.id}</td>
                <td className="py-2 px-2">{item.name || item.extension}</td>
                <td className="py-2 px-2 flex gap-2">
                  <button className="cursor-pointer hover:text-blue-600"><Pencil size={18} /></button>
                  <button className="cursor-pointer hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;