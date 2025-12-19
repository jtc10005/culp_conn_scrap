import { RefObject } from "react";
import { ViewBox } from "@models";
import { animateZoom } from "@functions";

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
    animateZoom(svg, viewBox, { ...viewBox.current }, target);
}

