import * as d3 from 'd3';

export interface TreeIllustrationOptions {
  treeWidth: number;
  treeHeight: number;
  showProgenitor?: boolean;
  progenitorName?: string;
  progenitorSubtitle?: string;
  onProgenitorClick?: () => void;
}

/**
 * Draws a decorative tree illustration (trunk, branches, leaves) on a D3 selection
 */
export function drawTreeIllustration(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  options: TreeIllustrationOptions
) {
  const {
    treeWidth,
    treeHeight,
    showProgenitor = true,
    progenitorName = 'Henry Culpeper',
    progenitorSubtitle = 'of Lower Norfolk',
    onProgenitorClick,
  } = options;

  // Create the tree illustration group
  const treeIllustration = g.append('g').attr('class', 'tree-illustration');

  // Tree trunk - MUCH WIDER to contain the family tree spread
  treeIllustration
    .append('path')
    .attr(
      'd',
      `M ${treeWidth / 2 - 200},${treeHeight} 
       L ${treeWidth / 2 - 100},${treeHeight * 0.5} 
       L ${treeWidth / 2 + 100},${treeHeight * 0.5} 
       L ${treeWidth / 2 + 200},${treeHeight} Z`
    )
    .attr('fill', '#8b6f47')
    .attr('opacity', 1);

  // Main branches - extend VERY WIDE to cover family tree width
  const branches = [
    // Wide spreading branches from mid-trunk
    {
      x1: treeWidth / 2 - 100,
      y1: treeHeight * 0.5,
      x2: treeWidth / 2 - 1200,
      y2: treeHeight * 0.4,
      curve: 200,
      width: 20,
    },
    {
      x1: treeWidth / 2 + 100,
      y1: treeHeight * 0.5,
      x2: treeWidth / 2 + 1200,
      y2: treeHeight * 0.4,
      curve: -200,
      width: 20,
    },

    // Level 2 - even wider
    {
      x1: treeWidth / 2 - 100,
      y1: treeHeight * 0.4,
      x2: treeWidth / 2 - 1400,
      y2: treeHeight * 0.3,
      curve: 250,
      width: 18,
    },
    {
      x1: treeWidth / 2 + 100,
      y1: treeHeight * 0.4,
      x2: treeWidth / 2 + 1400,
      y2: treeHeight * 0.3,
      curve: -250,
      width: 18,
    },

    // Level 3 - widest spread
    {
      x1: treeWidth / 2 - 100,
      y1: treeHeight * 0.3,
      x2: treeWidth / 2 - 1600,
      y2: treeHeight * 0.2,
      curve: 300,
      width: 15,
    },
    {
      x1: treeWidth / 2 + 100,
      y1: treeHeight * 0.3,
      x2: treeWidth / 2 + 1600,
      y2: treeHeight * 0.2,
      curve: -300,
      width: 15,
    },

    // Upper branches spreading even wider
    {
      x1: treeWidth / 2 - 100,
      y1: treeHeight * 0.2,
      x2: treeWidth / 2 - 1800,
      y2: treeHeight * 0.1,
      curve: 350,
      width: 12,
    },
    {
      x1: treeWidth / 2 + 100,
      y1: treeHeight * 0.2,
      x2: treeWidth / 2 + 1800,
      y2: treeHeight * 0.1,
      curve: -350,
      width: 12,
    },

    // Secondary branches filling in the gaps
    {
      x1: treeWidth / 2 - 1200,
      y1: treeHeight * 0.4,
      x2: treeWidth / 2 - 1500,
      y2: treeHeight * 0.25,
      curve: 150,
      width: 12,
    },
    {
      x1: treeWidth / 2 + 1200,
      y1: treeHeight * 0.4,
      x2: treeWidth / 2 + 1500,
      y2: treeHeight * 0.25,
      curve: -150,
      width: 12,
    },
    {
      x1: treeWidth / 2 - 1400,
      y1: treeHeight * 0.3,
      x2: treeWidth / 2 - 1700,
      y2: treeHeight * 0.15,
      curve: 180,
      width: 10,
    },
    {
      x1: treeWidth / 2 + 1400,
      y1: treeHeight * 0.3,
      x2: treeWidth / 2 + 1700,
      y2: treeHeight * 0.15,
      curve: -180,
      width: 10,
    },
  ];

  branches.forEach((branch) => {
    treeIllustration
      .append('path')
      .attr(
        'd',
        `M ${branch.x1},${branch.y1} Q ${branch.x1 + branch.curve},${
          (branch.y1 + branch.y2) / 2
        } ${branch.x2},${branch.y2}`
      )
      .attr('stroke', '#a0826d')
      .attr('stroke-width', branch.width)
      .attr('fill', 'none')
      .attr('opacity', 1)
      .attr('stroke-linecap', 'round');
  });

  // Leaves - many more leaves across the wider canopy
  const leafPositions = [
    ...Array(120)
      .fill(0)
      .map(() => ({
        x: treeWidth / 2 - 1700 + Math.random() * 600,
        y: treeHeight * 0.05 + Math.random() * 200,
      })),
    ...Array(120)
      .fill(0)
      .map(() => ({
        x: treeWidth / 2 + 1100 + Math.random() * 600,
        y: treeHeight * 0.05 + Math.random() * 200,
      })),
    ...Array(100)
      .fill(0)
      .map(() => ({
        x: treeWidth / 2 - 900 + Math.random() * 1800,
        y: treeHeight * 0.1 + Math.random() * 150,
      })),
    ...Array(100)
      .fill(0)
      .map(() => ({
        x: treeWidth / 2 - 600 + Math.random() * 1200,
        y: treeHeight * 0.05 + Math.random() * 100,
      })),
  ];

  leafPositions.forEach((pos) => {
    treeIllustration
      .append('circle')
      .attr('cx', pos.x)
      .attr('cy', pos.y)
      .attr('r', 3 + Math.random() * 4)
      .attr('fill', '#4caf50')
      .attr('opacity', 0.8 + Math.random() * 0.2);
  });

  // Add progenitor label at the base of the tree (optional)
  if (showProgenitor) {
    const progenitorGroup = treeIllustration
      .append('g')
      .attr('class', 'progenitor')
      .style('cursor', onProgenitorClick ? 'pointer' : 'default');

    if (onProgenitorClick) {
      progenitorGroup.on('click', onProgenitorClick);
    }

    // Background plate for the name
    progenitorGroup
      .append('rect')
      .attr('x', treeWidth / 2 - 150)
      .attr('y', treeHeight - 100)
      .attr('width', 300)
      .attr('height', 70)
      .attr('fill', '#1f2937')
      .attr('stroke', '#8b6f47')
      .attr('stroke-width', 3)
      .attr('rx', 8)
      .style('filter', 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))');

    // Progenitor name
    progenitorGroup
      .append('text')
      .attr('x', treeWidth / 2)
      .attr('y', treeHeight - 65)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('font-weight', '700')
      .attr('fill', '#ffffff')
      .text(progenitorName);

    // Subtitle
    progenitorGroup
      .append('text')
      .attr('x', treeWidth / 2)
      .attr('y', treeHeight - 42)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#d1d5db')
      .text(progenitorSubtitle);

    // Clickable hint
    if (onProgenitorClick) {
      progenitorGroup
        .append('text')
        .attr('x', treeWidth / 2)
        .attr('y', treeHeight - 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#9ca3af')
        .text('Click to view details');
    }
  }

  return treeIllustration;
}
