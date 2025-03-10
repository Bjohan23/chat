import React from 'react';
import CreateGroupForm from '../components/Groups/CreateGroupForm';

const CreateGroupPage = () => {
  return (
    <div className="min-h-screen bg-theme-bg-primary pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <CreateGroupForm />
    </div>
  );
};

export default CreateGroupPage;