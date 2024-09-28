import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { WorkflowStep, Connection } from '../interfaces/interfaces';

function Workflow({ workflowId }: { workflowId: string }) {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState<WorkflowStep[]>([]);
  const [links, setLinks] = useState<Connection[]>([]);

  useEffect(() => {
    fetch(`/api/workflow/${workflowId}`)
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes);
        setLinks(data.relationships);
      });
  }, [workflowId]);

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 10)
      .call(d3.drag()
        .on('start', (event, d) => dragstarted(event, d, simulation))
        .on('drag', dragged)
        .on('end', dragended));

    node.append('title')
      .text((d: any) => d.type);

    simulation
      .nodes(nodes)
      .on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });

    simulation.force('link').links(links);

    function dragstarted(event: any, d: any, simulation: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [nodes, links]);

  return (
    <div>
      <button onClick={() => addNode()}>Add Node</button>
      <svg ref={svgRef}></svg>
    </div>
  );

  function addNode() {
    const newNode: WorkflowStep = { id: Date.now().toString(), type: 'Node', position: { x: Math.random() * 300, y: Math.random() * 200 }, config: {} };
    setNodes([...nodes, newNode]);

    // Save to backend
    fetch(`/api/workflow/${workflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'Node', properties: newNode }),
    });
  }
}

export default Workflow;