'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type TreeNode = {
  id: string;
  name: string;
  birth?: string;
  gender?: string;
  children: string[];
};

export default function FamilyTree() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRenderTree = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tree');
        if (!response.ok) throw new Error('Failed to fetch tree data');
        
        const data = await response.json();
        renderTree(data.nodes);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchAndRenderTree();
  }, []);

  const renderTree = (nodes: TreeNode[]) => {
    if (!svgRef.current || nodes.length === 0) return;

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 1200;
    const height = 800;
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    // Create a map of nodes
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Build hierarchy
    const root = nodes[0]; // Start with root person (Henry Culpeper)
    const hierarchy = d3.hierarchy(root, (d: TreeNode) =>
      d.children?.map((childId) => nodeMap.get(childId)).filter(Boolean) as TreeNode[]
    );

    const treeLayout = d3.tree<TreeNode>().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    const treeData = treeLayout(hierarchy);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Draw links
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('d', (d) => {
        return `M${d.source.y},${d.source.x}L${d.target.y},${d.target.x}`;
      });

    // Draw nodes
    const node = g
      .selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    // Add circles
    node
      .append('circle')
      .attr('r', 6)
      .attr('fill', (d) => (d.data.gender === 'Male' ? '#3b82f6' : '#ec4899'))
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add labels
    node
      .append('text')
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#1e293b')
      .text((d) => d.data.name)
      .style('cursor', 'pointer');

    // Add birth dates
    node
      .append('text')
      .attr('dy', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#64748b')
      .text((d) => (d.data.birth ? `b: ${d.data.birth}` : ''));

    // Add click handler
    node.on('click', (event, d) => {
      window.location.href = `/person/${d.data.id}`;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading family tree...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-50">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-2">Culpepper Family Tree</h1>
        <p className="text-gray-600 mb-4">
          Click on any person to view details. Use mouse wheel to zoom, drag to pan.
        </p>
      </div>
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
}
