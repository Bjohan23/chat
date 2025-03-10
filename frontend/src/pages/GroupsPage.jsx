import React from 'react';
import GroupList from '../components/Groups/GroupList';

const GroupsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Grupos de Chat</h1>
      <GroupList />
    </div>
  );
};

export default GroupsPage;
