'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type TreeNode = {
  id: string;
  name: string;
  birth?: string;
  death?: string;
  gender?: string;
  birthPlace?: string;
  deathPlace?: string;
  children: string[];
};

export default function FamilyTree() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    const fetchAndRenderTree = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching tree data...');
        const response = await fetch('/api/tree');
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch tree data');
        
        const data = await response.json();
        console.log('Received data:', data);
        console.log('Number of nodes:', data.nodes?.length);
        setTreeData(data.nodes);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching tree:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchAndRenderTree();
  }, []);

  const renderTree = (nodes: TreeNode[]) => {
    console.log('renderTree called with nodes:', nodes);
    if (!svgRef.current) {
      console.error('svgRef.current is null');
      return;
    }
    if (nodes.length === 0) {
      console.error('No nodes to render');
      return;
    }

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const width = container?.clientWidth || 1600;
    const height = container?.clientHeight || 900;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create a map of nodes
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Build hierarchy
    const root = nodes[0]; // Start with root person
    const hierarchy = d3.hierarchy(root, (d: TreeNode) =>
      d.children?.map((childId) => nodeMap.get(childId)).filter(Boolean) as TreeNode[]
    );

    // Use tree layout with more spacing
    const treeLayout = d3.tree<TreeNode>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));
    
    const treeData = treeLayout(hierarchy);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Track current zoom level
    let currentZoom = 1;

    // Draw links with smooth curves
    const linkGroup = g.append('g').attr('class', 'links');
    linkGroup.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2)
      .attr('d', (d) => {
        // Elbow connector
        return `M${d.source.y},${d.source.x}
                V${(d.source.x + d.target.x) / 2}
                H${d.target.y}
                V${d.target.x}`;
      });

    // Draw nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        window.location.href = `/person/${d.data.id}`;
      });

    // Add circles for nodes
    node
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', 8)
      .attr('fill', (d) => {
        if (d.data.gender === 'Male') return '#3b82f6';
        if (d.data.gender === 'Female') return '#ec4899';
        return '#94a3b8';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

    // Level 1: Just dots (visible at zoom < 0.5)
    // No additional elements needed, just the circles

    // Level 2: Add names (visible at zoom >= 0.5)
    const nameText = node
      .append('text')
      .attr('class', 'node-name')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#1e293b')
      .attr('opacity', 0)
      .text((d) => d.data.name);

    // Level 3: Add birth/death years (visible at zoom >= 1.5)
    const datesText = node
      .append('text')
      .attr('class', 'node-dates')
      .attr('dy', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#64748b')
      .attr('opacity', 0)
      .text((d) => {
        const birth = d.data.birth ? d.data.birth.split('-')[0] : '';
        const death = d.data.death ? d.data.death.split('-')[0] : '';
        if (birth && death) return `${birth} - ${death}`;
        if (birth) return `b. ${birth}`;
        if (death) return `d. ${death}`;
        return '';
      });

    // Level 4: Add detailed info box (visible at zoom >= 3)
    const detailBox = node
      .append('g')
      .attr('class', 'node-details')
      .attr('opacity', 0);

    detailBox
      .append('rect')
      .attr('x', 15)
      .attr('y', -30)
      .attr('width', 200)
      .attr('height', 60)
      .attr('fill', 'white')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1)
      .attr('rx', 4)
      .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))');

    detailBox
      .append('text')
      .attr('x', 20)
      .attr('y', -15)
      .attr('font-size', '11px')
      .attr('fill', '#475569')
      .text((d) => d.data.birthPlace ? `Born: ${d.data.birthPlace}` : '');

    detailBox
      .append('text')
      .attr('x', 20)
      .attr('y', 0)
      .attr('font-size', '11px')
      .attr('fill', '#475569')
      .text((d) => d.data.deathPlace ? `Died: ${d.data.deathPlace}` : '');

    detailBox
      .append('text')
      .attr('x', 20)
      .attr('y', 15)
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .text((d) => `ID: ${d.data.id}`);

    // Function to update detail level based on zoom
    function updateDetailLevel(zoomLevel: number) {
      // Level 1: Just circles (always visible)
      
      // Level 2: Names appear at zoom >= 0.5
      nameText.attr('opacity', zoomLevel >= 0.5 ? 1 : 0);
      
      // Level 3: Dates appear at zoom >= 1.5
      datesText.attr('opacity', zoomLevel >= 1.5 ? 1 : 0);
      
      // Level 4: Detail boxes appear at zoom >= 3
      detailBox.attr('opacity', zoomLevel >= 3 ? 1 : 0);

      // Scale node circles based on zoom (smaller when zoomed out)
      node.selectAll('.node-circle')
        .attr('r', Math.max(4, Math.min(10, 8 / Math.sqrt(zoomLevel))));
    }

    // Add zoom behavior with wider range
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        currentZoom = event.transform.k;
        g.attr('transform', event.transform);
        updateDetailLevel(currentZoom);
      });

    svg.call(zoom);

    // Initial zoom to fit
    const initialScale = 0.5;
    svg.call(zoom.transform, d3.zoomIdentity.translate(100, height / 2).scale(initialScale));
    currentZoom = initialScale;

    // Initialize detail level
    updateDetailLevel(currentZoom);
  };

  useEffect(() => {
    if (treeData.length > 0 && svgRef.current) {
      console.log('Rendering tree with', treeData.length, 'nodes');
      renderTree(treeData);
    }
  }, [treeData]);

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
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4">
        <h1 className="text-2xl font-bold text-slate-900">Culpepper Family Tree</h1>
        <p className="text-sm text-slate-600 mt-1">
          🖱️ Click nodes for details • 🔍 Scroll to zoom • ✋ Drag to pan • More details appear as you zoom in
        </p>
      </div>
      <div className="w-full h-full pt-20">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
}
