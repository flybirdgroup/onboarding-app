export interface WorkflowStep {
  id: string;
  type: string;
  position: { x: number; y: number };
  config: any;
}

export interface Connection {
  from: string;
  to: string;
}