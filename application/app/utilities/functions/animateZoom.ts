import { RefObject } from "react";
import { ViewBox } from "@models";

export function animateZoom(
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