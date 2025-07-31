import React from 'react';
import UserManagement from '../../components/admin/UserManagement';
import DataManagement from '../../components/admin/DataManagement';

const Dashboard = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-2 font-[Poppins]">
      {/* Users Section */}
      <UserManagement />
      
      {/* Category/Format/Logiciel Section */}
      <DataManagement />
    </div>
  );
};

export default Dashboard;