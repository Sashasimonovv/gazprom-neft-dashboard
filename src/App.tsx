import React from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { DashboardPage } from './features/dashboard/DashboardPage';
import './App.css';

const App: React.FC = () => (
  <Theme preset={presetGpnDefault}>
    <div className="appShell">
      <DashboardPage />
    </div>
  </Theme>
);

export default App;
