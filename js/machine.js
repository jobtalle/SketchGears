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
        const scale = 256;
        const uri = svg.getAttribute("xmlns");
        const svgMaker = new SVGMaker(uri);
        const layerContainer = document.createElementNS(uri, "g");
        const layerMoving = document.createElementNS(uri, "g");
        const layerForeground = document.createElementNS(uri, "g");
        const gridDimensions = Machine.GRID_RADIUS * 2 + 1;
        const grid = new Array(gridDimensions * gridDimensions).fill(null);
        const initial = grid[Machine.GRID_RADIUS * gridDimensions + Machine.GRID_RADIUS] = new PartGear(
            Machine.GRID_RADIUS,
            Machine.GRID_RADIUS);

        const open = [initial];

        let part = null;

        while (part = open.pop()) {
            part.makeElement(
                svgMaker,
                this.getX(part.x),
                this.getY(part.x, part.y),
                layerMoving,
                layerForeground);
        }

        layerContainer.setAttribute("transform",
            "translate(" +
            (width * .5 - scale * this.getX(Machine.GRID_RADIUS)).toString() + "," +
            (height * .5 - scale * this.getY(Machine.GRID_RADIUS, Machine.GRID_RADIUS)).toString() + ")" +
            "scale(" + scale.toString() + ")");
        layerContainer.appendChild(layerMoving);
        layerContainer.appendChild(layerForeground);
        svg.appendChild(layerContainer);
    }

    /**
     * Convert a grid to a world coordinate
     * @param {number} x The Y coordinate
     * @returns {number} The world coordinate
     */
    getX(x) {
        return x * Math.sqrt(3);
    }

    /**
     * Convert a grid to a world coordinate
     * @param {number} x The Y coordinate
     * @param {number} y The Y coordinate
     * @returns {number} The world coordinate
     */
    getY(x, y) {
        return y * 2 + x;
    }

    /**
     * Update the machine
     * @param {number} dt The time delta in seconds
     */
    update(dt) {

    }
}