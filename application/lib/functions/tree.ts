
import { ViewBox } from "@models";
import { animateZoom as _animateZoom } from "./animateZoom";

const NS = "http://www.w3.org/2000/svg";

export function treeSVG(
    svg: SVGSVGElement,
    viewBoxRef: React.MutableRefObject<ViewBox>
) {

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


    return {
        branch,
        drawLine,
        drawLeaf
    }
}