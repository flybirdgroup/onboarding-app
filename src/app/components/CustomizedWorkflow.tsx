'use client';

import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface WorkflowStep {
  id: string;
  type: string;
  position: { x: number; y: number };
}

interface Link {
  id: string;
  from: string;
  to: string;
}

const workflowSteps = [
  { type: 'Github Repo', icon: '📁' },
  { type: 'Deployment', icon: '🚀' },
  { type: 'Cyberflow', icon: '🔒' },
  { type: 'SonartypeIQScan', icon: '🔍' },
  { type: 'Raise CR', icon: '📝' },
];

const WorkflowItem: React.FC<{ 
  step: WorkflowStep; 
  onMove: (id: string, left: number, top: number) => void;
  onStartLink: (id: string) => void;
  onEndLink: (id: string) => void;
}> = ({ step, onMove, onStartLink, onEndLink }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'workflowStep',
    item: { id: step.id, left: step.position.x, top: step.position.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'workflowStep',
    hover(item: { id: string; left: number; top: number }, monitor) {
      if (item.id !== step.id) {
        return;
      }
      const { x, y } = monitor.getClientOffset() || { x: 0, y: 0 };
      onMove(item.id, x, y);
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        position: 'absolute',
        left: step.position.x,
        top: step.position.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      className="bg-white border border-gray-300 rounded-full p-4 shadow-md"
      onMouseDown={() => onStartLink(step.id)}
      onMouseUp={() => onEndLink(step.id)}
    >
      {workflowSteps.find(ws => ws.type === step.type)?.icon} {step.type}
    </div>
  );
};

const CustomizedWorkflow: React.FC = () => {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [linkStart, setLinkStart] = useState<string | null>(null);

  const moveStep = (id: string, left: number, top: number) => {
    setWorkflow(prevWorkflow =>
      prevWorkflow.map(step =>
        step.id === id ? { ...step, position: { x: left, y: top } } : step
      )
    );
  };

  const addStep = (type: string) => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type,
      position: { x: Math.random() * 300, y: Math.random() * 200 },
    };
    setWorkflow(prevWorkflow => [...prevWorkflow, newStep]);
  };

  const startLink = (id: string) => {
    setLinkStart(id);
  };

  const endLink = (id: string) => {
    if (linkStart && linkStart !== id) {
      setLinks(prevLinks => [
        ...prevLinks,
        { id: `${linkStart}-${id}`, from: linkStart, to: id }
      ]);
      setLinkStart(null);
    }
  };

  const renderLinks = () => {
    return links.map(link => {
      const fromStep = workflow.find(step => step.id === link.from);
      const toStep = workflow.find(step => step.id === link.to);
      if (!fromStep || !toStep) return null;

      return (
        <svg key={link.id} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <line
            x1={fromStep.position.x + 50}
            y1={fromStep.position.y + 50}
            x2={toStep.position.x + 50}
            y2={toStep.position.y + 50}
            stroke="black"
            strokeWidth="2"
          />
        </svg>
      );
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customized Workflow</h2>
      <div className="flex mb-4">
        {workflowSteps.map((step) => (
          <button
            key={step.type}
            onClick={() => addStep(step.type)}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {step.icon} {step.type}
          </button>
        ))}
      </div>
      <div className="border border-gray-300 h-96 relative">
        {renderLinks()}
        {workflow.map((step) => (
          <WorkflowItem 
            key={step.id} 
            step={step} 
            onMove={moveStep}
            onStartLink={startLink}
            onEndLink={endLink}
          />
        ))}
      </div>
    </div>
  );
};

const CustomizedWorkflowWithDnD: React.FC = () => (
  <DndProvider backend={HTML5Backend}>
    <CustomizedWorkflow />
  </DndProvider>
);

export default CustomizedWorkflowWithDnD;