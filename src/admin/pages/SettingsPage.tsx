import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-1">Manage system configurations</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-white">System settings management will be implemented here.</p>
      </div>
    </div>
  );
};

export default SettingsPage;