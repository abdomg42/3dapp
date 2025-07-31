import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useUserAdminStore } from '../../store/UserAdminStore';
import Modal from '../Modal';

const UserManagement = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [UserForm, setUserForm] = useState({ name: '', email: '', password: '', role: '' });

  const { Users, fetchUsers, addUser, updateUser, removeUser } = useUserAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-[#7A6B3F] mb-2">All User</h2>
      <div className="flex justify-end mb-2">
        <button
          className="cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2"
          onClick={() => setIsUserModalOpen(true)}
        >
          <Plus size={18} /> Add
        </button>
      </div>
      <div className="bg-[#fafafa] rounded-xl shadow p-6">
        <table className="table w-full">
          <thead>
            <tr className="text-gray-500 font-semibold text-base">
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
                <td className="py-2 px-2">{user.created_at}</td>
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
      </div>

      {/* Add User Modal */}
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
          <button type="submit" className="w-full cursor-pointer bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Add</button>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isUserEditModalOpen}
        onClose={() => setIsUserEditModalOpen(false)}
        title="Update User"
      >
        <form onSubmit={handleUpdateUser} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input name="name" value={UserForm.name} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input name="email" type="email" value={UserForm.email} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input name="password" type="password" value={UserForm.password} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <input name="role" value={UserForm.role} onChange={handleUserFormChange} className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full cursor-pointer bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Update</button>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isUserDeleteModalOpen}
        onClose={() => setIsUserDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="text-center text-red-700 py-8">
          Are you sure you want to delete user: <b>{selectedUser?.name}</b>?
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDeleteUser}>Delete</button>
            <button className="bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={() => setIsUserDeleteModalOpen(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement; 