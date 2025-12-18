import { RefObject } from "react";
import { ViewBox } from "@models";

export function clickZoom(svg: SVGSVGElement, viewBox: RefObject<ViewBox>, e: MouseEvent) {

    const rect = svg.getBoundingClientRect();

    const mx =
        viewBox.current.x +
        (e.clientX - rect.left) *
        (viewBox.current.width / rect.width);

    const my =
        viewBox.current.y +
        (e.clientY - rect.top) *
        (viewBox.current.height / rect.height);

    const zoomFactor = e.shiftKey ? 2 : 0.5;

    const target = {
        x: mx - (viewBox.current.width * zoomFactor) / 2,
        y: my - (viewBox.current.height * zoomFactor) / 2,
        width: viewBox.current.width * zoomFactor,
        height: viewBox.current.height * zoomFactor,
    };
    animateViewBox(svg, viewBox, { ...viewBox.current }, target);
}

function animateViewBox(
    svg: SVGSVGElement,
    viewBox: RefObject<ViewBox>,
    from: ViewBox,
    to: ViewBox,
    duration = 200
) {
    const start = performance.now();

    function frame(now: number) {
        const t = Math.min((now - start) / duration, 1);

        // Ease-out (feels natural)
        const eased = 1 - Math.pow(1 - t, 3);

        const x = from.x + (to.x - from.x) * eased;
        const y = from.y + (to.y - from.y) * eased;
        const width = from.width + (to.width - from.width) * eased;
        const height = from.height + (to.height - from.height) * eased;

        viewBox.current = { x, y, width, height };

        svg.setAttribute(
            "viewBox",
            `${x} ${y} ${width} ${height}`
        );

        if (t < 1) {
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}