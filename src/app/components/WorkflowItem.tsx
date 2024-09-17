import React from 'react';
import { useDrag } from 'react-dnd';
import { WorkflowStep } from '../interfaces/interfaces';

interface WorkflowItemProps {
  step: WorkflowStep;
  onSelect: (step: WorkflowStep) => void;
}

export const WorkflowItem: React.FC<WorkflowItemProps> = ({ step, onSelect }) => {
  const [, drag] = useDrag(() => ({
    type: 'workflowStep',
    item: { id: step.id },
  }));

  return (
    <div
      ref={drag}
      onClick={() => onSelect(step)}
      className="bg-white border border-gray-300 rounded-full p-4 shadow-md"
      style={{ position: 'absolute', left: step.position.x, top: step.position.y }}
    >
      {`${step.type}: ${step.id}`}
    </div>
  );
};

export const workflowSteps = [
  { type: 'GitHub Repo', icon: '📁' },
  { type: 'Deployment', icon: '🚀' },
  { type: 'Cyber Scan', icon: '🔒' },
  { type: 'Create CR', icon: '📝' },
];