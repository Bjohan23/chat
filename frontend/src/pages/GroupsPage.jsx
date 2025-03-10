import React from 'react';
import GroupList from '../components/Groups/GroupList';

const GroupsPage = () => {
  return (
    <div className="min-h-screen bg-theme-bg-primary pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <GroupList />
    </div>
  );
};

export default GroupsPage;