'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { drawTreeIllustration } from '@/components/TreeIllustration';
import { ViewBox } from '@models';
import { clickZoom } from '@functions';

export default function PracticePage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewBox = useRef<ViewBox>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  useEffect(() => {
  const svg = svgRef.current;
  if (!svg) return;

  const width = svg.clientWidth;
  const height = svg.clientHeight;

  viewBox.current = {
    x: 0,
    y: 0,
    width,
    height,
  };

  svg.setAttribute(
    "viewBox",
    `0 0 ${width} ${height}`
  );

  const NS = "http://www.w3.org/2000/svg";

  // -------- DRAW TREE (unchanged) --------
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  function drawLine(x1: number, y1: number, x2: number, y2: number, w: number) {
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", `${x1}`);
    line.setAttribute("y1", `${y1}`);
    line.setAttribute("x2", `${x2}`);
    line.setAttribute("y2", `${y2}`);
    line.setAttribute("stroke", "#5d4037");
    line.setAttribute("stroke-width", `${w}`);
    line.setAttribute("stroke-linecap", "round");
    svg!.appendChild(line);
  }

  function drawLeaf(x: number, y: number) {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", `${x}`);
    c.setAttribute("cy", `${y}`);
    c.setAttribute("r", "8");
    c.setAttribute("fill", "#2e7d32");
    svg!.appendChild(c);
  }

  function branch(x: number, y: number, len: number, angle: number, depth: number) {
    if (depth === 0) {
      drawLeaf(x, y);
      return;
    }

    const x2 = x + len * Math.cos(angle);
    const y2 = y - len * Math.sin(angle);

    drawLine(x, y, x2, y2, depth);

    const spread = 0.35;
    branch(x2, y2, len * 0.75, angle - spread, depth - 1);
    branch(x2, y2, len * 0.75, angle + spread, depth - 1);
  }

  branch(width / 2, height - 20, height / 4, Math.PI / 2, 9);

function onDoubleClick(e: MouseEvent) {
  e.preventDefault();
  const zoomFactor = e.shiftKey ? 2 : 0.5;
 clickZoom(svg!, viewBox, e);
}
  // -------- ZOOM HANDLER --------
  function onWheel(e: WheelEvent) {
    e.preventDefault();

    const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;
    const rect = svg!.getBoundingClientRect();

    // Cursor position in SVG space
    const mx =
      viewBox.current.x +
      (e.clientX - rect.left) *
        (viewBox.current.width / rect.width);

    const my =
      viewBox.current.y +
      (e.clientY - rect.top) *
        (viewBox.current.height / rect.height);

    const newWidth = viewBox.current.width * zoomFactor;
    const newHeight = viewBox.current.height * zoomFactor;

    viewBox.current.x = mx - (mx - viewBox.current.x) * zoomFactor;
    viewBox.current.y = my - (my - viewBox.current.y) * zoomFactor;
    viewBox.current.width = newWidth;
    viewBox.current.height = newHeight;

    svg!.setAttribute(
      "viewBox",
      `${viewBox.current.x} ${viewBox.current.y} ${newWidth} ${newHeight}`
    );
  }

  svg.addEventListener("wheel", onWheel, { passive: false });
svg.addEventListener("dblclick", onDoubleClick);

return () => {
  svg.removeEventListener("wheel", onWheel);
  svg.removeEventListener("dblclick", onDoubleClick);
};
}, []);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     console.log('Practice page rendering...');

//     // Clear existing content
//     d3.select(svgRef.current).selectAll('*').remove();

//     const container = svgRef.current.parentElement;
//     const width = container?.clientWidth || 1600;
//     const height = container?.clientHeight || 900;
//     const margin = { top: 20, right: 20, bottom: 20, left: 20 };

//     console.log('Container dimensions:', width, height);

//     const svg = d3
//       .select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height)
//       .attr('viewBox', [0, 0, width, height]);

//     // Make tree MUCH larger to accommodate family tree nodes
//     const treeScale = 3; // Scale up the tree
//     const treeWidth = width * treeScale;
//     const treeHeight = height * treeScale;

//     console.log('Tree dimensions:', treeWidth, treeHeight);

//     const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

//     // Draw the tree illustration
//     console.log('Drawing tree illustration...');
//     const treeIllustration = drawTreeIllustration(g, {
//       treeWidth,
//       treeHeight,
//       showProgenitor: true,
//       progenitorName: 'Practice Tree',
//       progenitorSubtitle: 'SVG Experimentation',
//     });

//     console.log('Tree illustration drawn');

//     // ADD YOUR CUSTOM ELEMENTS HERE
//     // The trunk base is at (treeWidth/2, treeHeight)
    
//     // Example 1: Add a circle at the base of the trunk
//     g.append('circle')
//       .attr('cx', treeWidth / 2)
//       .attr('cy', treeHeight)
//       .attr('r', 50)
//       .attr('fill', 'red')
//       .attr('stroke', 'yellow')
//       .attr('stroke-width', 5);

//     // Example 2: Add text at the base
//     g.append('text')
//       .attr('x', treeWidth / 2)
//       .attr('y', treeHeight + 100)
//       .attr('text-anchor', 'middle')
//       .attr('font-size', '40px')
//       .attr('fill', 'white')
//       .text('Custom Element');

//     // Example 3: Add a rectangle
//     g.append('rect')
//       .attr('x', treeWidth / 2 - 100)
//       .attr('y', treeHeight - 200)
//       .attr('width', 200)
//       .attr('height', 150)
//       .attr('fill', 'purple')
//       .attr('opacity', 0.5);

//     // Add zoom behavior with wider range
//     const zoom = d3.zoom<SVGSVGElement, unknown>()
//       .scaleExtent([0.1, 10])
//       .on('zoom', (event) => {
//         g.attr('transform', event.transform);
//       });

//     svg.call(zoom);

//     // Initial zoom to fit - start zoomed WAY out to see whole tree, centered
//     const initialScale = 0.25; // Zoom out more to see the large tree
//     const initialTransform = d3.zoomIdentity
//       .translate(width / 2, height / 2)
//       .scale(initialScale)
//       .translate(-treeWidth / 2, -treeHeight / 2);
    
//     console.log('Setting initial zoom:', initialScale);
//     svg.call(zoom.transform, initialTransform);

//   }, []);

  return (
    <div className="w-full h-screen relative">
      <div className="w-full h-full">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
}
