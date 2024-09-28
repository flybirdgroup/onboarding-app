'use client';

import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import OnboardingForm from '../components/OnboardingForm';
import AboutUs from '../components/AboutUs';
import ProjectViewForm from '../components/ProjectViewForm';
import Workflow from '../components/Workflow';
import ScanningForm from '../components/ScanningForm';
import DeploymentForm from '../components/DeploymentForm';

function DebugUserInfo() {
  const { username } = useUser();
  return <div className="bg-yellow-200 p-2 mb-4">Current user: {username || 'Not logged in'}</div>;
}

const tabs = [
  { id: 'onboarding', label: 'Onboarding to One-click-CICD' },
  { id: 'aboutUs', label: 'About Us' },
  { id: 'projectview', label: 'Project Overview' },
  { id: 'customWorkflow', label: 'Custom Workflow' },
  { id: 'scanning', label: 'Scanning' },
  { id: 'deployment', label: 'Deployment' },
];

export default function Main() {
  const [activeTab, setActiveTab] = useState('onboarding');

  const renderContent = () => {
    switch (activeTab) {
      case 'onboarding':
        return <OnboardingForm />;
      case 'aboutUs':
        return <AboutUs />;
      case 'projectview':
        return <ProjectViewForm />;
      case 'customWorkflow':
        return <Workflow workflowId="your_workflow_id" />;
      case 'scanning':
        return <ScanningForm />;
      case 'deployment':
        return <DeploymentForm />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DebugUserInfo />
      <div className="flex flex-1">
        <div className="w-64 bg-gray-100 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`block w-full text-left px-4 py-2 mb-2 ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">One-Click-CICD Onboarding</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}