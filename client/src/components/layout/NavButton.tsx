import React from 'react';
import { LayoutDashboard, Newspaper, Users, GraduationCap } from 'lucide-react';
import type { Tab } from '../../types';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  tabId: Tab;
}

const iconMap: Record<Tab, React.ReactNode> = {
  WAR_ROOM: <LayoutDashboard style={{ width: '1rem', height: '1rem' }} />,
  GLOBAL_FEED: <Newspaper style={{ width: '1rem', height: '1rem' }} />,
  AGENT_INTEL: <Users style={{ width: '1rem', height: '1rem' }} />,
  THEORY_LAB: <GraduationCap style={{ width: '1rem', height: '1rem' }} />,
};

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, label, tabId }) => (
  <button
    onClick={onClick}
    className={`nav-btn ${active ? 'active' : ''}`}
    id={`nav-${tabId.toLowerCase()}`}
  >
    {iconMap[tabId]}
    <span>{label}</span>
  </button>
);

export default NavButton;
