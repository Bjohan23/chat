import React from 'react';
import CreateGroupForm from '../components/Groups/CreateGroupForm';

const CreateGroupPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Crear Nuevo Grupo</h1>
      <CreateGroupForm />
    </div>
  );
};

export default CreateGroupPage;
