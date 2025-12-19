import { ViewBox } from "@models";
import { animateZoom as _animateZoom } from "./animateZoom";

export function createCameraController(
    svg: SVGSVGElement,
    viewBoxRef: React.MutableRefObject<ViewBox>
) {

    function setViewBox(vb: ViewBox) {
        viewBoxRef.current = vb;
        svg.setAttribute(
            "viewBox",
            `${vb.x} ${vb.y} ${vb.width} ${vb.height}`
        );
    }

    function animateZoom(from: ViewBox, to: ViewBox, duration = 200) {
        // Delegate to the standalone animateZoom function
        _animateZoom(svg, viewBoxRef, from, to, duration);
    }

    function zoomAtPoint(cx: number, cy: number, factor: number) {
        const vb = viewBoxRef.current;

        animateZoom(vb, {
            x: cx - (vb.width * factor) / 2,
            y: cy - (vb.height * factor) / 2,
            width: vb.width * factor,
            height: vb.height * factor,
        });
    }

    function panBy(dx: number, dy: number) {
        setViewBox({
            ...viewBoxRef.current,
            x: viewBoxRef.current.x + dx,
            y: viewBoxRef.current.y + dy,
        });
    }

    return {
        setViewBox,
        animateZoom,
        zoomAtPoint,
        panBy,
    };
}