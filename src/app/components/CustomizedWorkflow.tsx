'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WorkflowItem, workflowSteps } from './WorkflowItem';
import { Sidebar } from './Sidebar';
import { Arrow } from './Arrow';
import { WorkflowStep, Connection } from '../interfaces/interfaces';

const API_URL = '/api/workflows';

const CustomizedWorkflowContent: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [linkStart, setLinkStart] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);

  useEffect(() => {
    const loadWorkflow = async (workflowId: string) => {
      const response = await fetch(`${API_URL}/${workflowId}`);
      const data = await response.json();
      setWorkflow(data.nodes);
      setConnections(data.connections);
    };

    if (id) {
      loadWorkflow(id);
    }
  }, [id]);

  const addStep = (type: string) => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type,
      config: {},
      position: { x: Math.random() * 300, y: Math.random() * 200 },
    };
    setWorkflow(prevWorkflow => [...prevWorkflow, newStep]);
  };

  const startLink = (id: string) => {
    setLinkStart(id);
  };

  const endLink = (id: string) => {
    if (linkStart && linkStart !== id) {
      setConnections(prevConnections => [
        ...prevConnections,
        { from: linkStart, to: id }
      ]);
      setLinkStart(null);
    }
  };

  const onSelectStep = (step: WorkflowStep) => {
    setSelectedStep(step);
  };

  const runWorkflow = () => {
    console.log('Running workflow:', workflow, connections);
  };

  const saveWorkflow = async () => {
    if (!id) return;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'My Workflow',
        nodes: workflow,
        connections: connections,
      }),
    });
    if (response.ok) {
      alert('Workflow saved successfully');
    } else {
      alert('Error saving workflow');
    }
  };

  const [, drop] = useDrop(() => ({
    accept: 'workflowStep',
    drop: (item: { id: string }) => {
      endLink(item.id);
    },
  }));

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-4 p-4">CI/CD Workflow Designer</h2>
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
      <div className="flex flex-grow" ref={drop}>
        <div className="p-4 w-3/4 relative border border-gray-300 h-96">
          {workflow.map((step) => (
            <WorkflowItem 
              key={step.id} 
              step={step} 
              onStartLink={startLink}
              onEndLink={endLink}
              onSelect={onSelectStep}
            />
          ))}
          {connections.map((conn) => {
            const fromStep = workflow.find(s => s.id === conn.from);
            const toStep = workflow.find(s => s.id === conn.to);
            return fromStep && toStep ? (
              <Arrow 
                key={`${conn.from}-${conn.to}`}
                start={fromStep.position}
                end={toStep.position}
              />
            ) : null;
          })}
        </div>
        <Sidebar selectedStep={selectedStep} />
      </div>
      <div className="flex justify-center mt-4 p-4">
        <button onClick={runWorkflow} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Run Workflow
        </button>
        <button onClick={saveWorkflow} className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Save Workflow
        </button>
      </div>
    </div>
  );
};

const CustomizedWorkflow: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <CustomizedWorkflowContent />
    </DndProvider>
  );
};

export default CustomizedWorkflow;