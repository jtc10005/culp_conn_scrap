'use client';

import { useEffect, useRef } from 'react';
import { ViewBox } from '@models';
import { createCameraController, treeSVG } from '@functions';

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

    // Initialize viewBox state
    viewBox.current = {
      x: 0,
      y: 0,
      width,
      height,
    };

    // Create the camera controller
    const camera = createCameraController(svg, viewBox);
    const tree = treeSVG(svg, viewBox);

    // Set initial viewBox using camera controller
    camera.setViewBox({
      x: 0,
      y: 0,
      width,
      height,
    });

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    tree.branch(width / 2, height - 20, height / 4, Math.PI / 2, 9);

    // -------- EVENT HANDLERS using camera controller --------
    function onDoubleClick(e: MouseEvent) {
      e.preventDefault();
      const rect = svg!.getBoundingClientRect();

      // Convert mouse position to SVG coordinates
      const mx = viewBox.current.x + (e.clientX - rect.left) * (viewBox.current.width / rect.width);
      const my =
        viewBox.current.y + (e.clientY - rect.top) * (viewBox.current.height / rect.height);

      // Zoom in (0.5) or out (2) at mouse position
      const factor = e.shiftKey ? 2 : 0.5;
      camera.zoomAtPoint(mx, my, factor);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();

      const rect = svg!.getBoundingClientRect();

      // Convert mouse position to SVG coordinates
      const mx = viewBox.current.x + (e.clientX - rect.left) * (viewBox.current.width / rect.width);
      const my =
        viewBox.current.y + (e.clientY - rect.top) * (viewBox.current.height / rect.height);

      // Zoom in or out at mouse position
      const factor = e.deltaY < 0 ? 0.9 : 1.1;
      camera.zoomAtPoint(mx, my, factor);
    }

    // Optional: Add keyboard pan controls
    function onKeyDown(e: KeyboardEvent) {
      const panAmount = 50;
      switch (e.key) {
        case 'ArrowLeft':
          camera.panBy(-panAmount, 0);
          break;
        case 'ArrowRight':
          camera.panBy(panAmount, 0);
          break;
        case 'ArrowUp':
          camera.panBy(0, -panAmount);
          break;
        case 'ArrowDown':
          camera.panBy(0, panAmount);
          break;
      }
    }

    svg.addEventListener('wheel', onWheel, { passive: false });
    svg.addEventListener('dblclick', onDoubleClick);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      svg.removeEventListener('wheel', onWheel);
      svg.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className="w-full h-screen relative theme-bg-primary">
      <div className="w-full h-full">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
}
