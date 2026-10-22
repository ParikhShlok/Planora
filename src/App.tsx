import React, { useState } from 'react';
import { PlanoraProvider, usePlanora } from './context/PlanoraContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewTab } from './components/Overview/OverviewTab';
import { BudgetTab } from './components/Budget/BudgetTab';
import { TimelineTab } from './components/Timeline/TimelineTab';
import { VendorsTab } from './components/Vendors/VendorsTab';
import { IdeasTab } from './components/Ideas/IdeasTab';
import { AssistantTab } from './components/Assistant/AssistantTab';
import { IntakeModal } from './components/Intake/IntakeModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { PrintableReport } from './components/Export/PrintableReport';

const PlanoraDashboard: React.FC = () => {
  const { activeTab } = usePlanora();
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* App Header */}
      <Header
        onOpenIntake={() => setIsIntakeOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
      />

      {/* Main Tab Navigation */}
      <Navigation />

      {/* Main Tab Workspace */}
      <main style={{ flex: 1, paddingBottom: '40px' }} role="main">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'budget' && <BudgetTab />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'vendors' && <VendorsTab />}
        {activeTab === 'ideas' && <IdeasTab />}
        {activeTab === 'assistant' && <AssistantTab />}
      </main>

      {/* Global Modals */}
      <IntakeModal isOpen={isIntakeOpen} onClose={() => setIsIntakeOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <PrintableReport isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <PlanoraProvider>
      <PlanoraDashboard />
    </PlanoraProvider>
  );
}
