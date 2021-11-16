/**
 * A machine
 */
class Machine {
    static GRID_RADIUS = 10;

    /**
     * Construct a machine
     * @param {number} width The width in pixels
     * @param {number} height The height in pixels
     * @param {SVGSVGElement} svg The SVG element to create items on
     * @param {Random} random A randomizer
     */
    constructor(width, height, svg, random) {
        const uri = svg.getAttribute("xmlns");
        const svgMaker = new SVGMaker(uri);
        const layerContainer = document.createElementNS(uri, "g");
        const layerMoving = document.createElementNS(uri, "g");
        const layerForeground = document.createElementNS(uri, "g");
        const gridDimensions = Machine.GRID_RADIUS * 2 + 1;
        const grid = new Array(gridDimensions * gridDimensions).fill(null);
        const initial = grid[Machine.GRID_RADIUS * gridDimensions + Machine.GRID_RADIUS] = new Part(
            gridDimensions,
            gridDimensions);

        const open = [initial];

        for (const part of open)
            part.makeElement(
                svgMaker,
                gridDimensions,
                gridDimensions,
                layerMoving,
                layerForeground);

        layerContainer.setAttribute("transform",
            "translate(" +
            (width * .5).toString() + "," +
            (height * .5).toString() + ")" +
            "scale(32)");
        layerContainer.appendChild(layerMoving);
        layerContainer.appendChild(layerForeground);
        svg.appendChild(layerContainer);
    }
}