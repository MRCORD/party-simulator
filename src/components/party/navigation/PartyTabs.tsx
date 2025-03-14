import React from 'react';
import { Tab } from '@/types/party';
import Tabs from '@/components/ui/Tabs';

interface PartyTabsProps {
  tabs: Tab[];
  activeTabIndex: number;
  onTabChange: (index: number) => void;
}

const PartyTabs: React.FC<PartyTabsProps> = ({
  tabs,
  activeTabIndex,
  onTabChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-2 mb-8">
      <Tabs
        tabs={tabs}
        initialTab={activeTabIndex}
        onChange={onTabChange}
        variant="pills"
        color="primary"
        size="md"
        fullWidth={false}
        className="animate-fadeIn"
      />
    </div>
  );
};

export default PartyTabs;