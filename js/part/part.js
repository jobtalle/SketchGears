/**
 * A machine part
 */
class Part {
    /**
     * Construct a part
     * @param {number} x The X position on the grid
     * @param {number} y The Y position on the grid
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Make the element for this part
     * @param {SVGMaker} svgMaker An SVG maker
     * @param {SVGGElement} layerMoving The moving parts layer
     * @param {SVGGElement} layerForeground The foreground layer
     * @returns {Part} This part
     */
    makeElement(svgMaker, layerMoving, layerForeground) {
        layerMoving.appendChild(svgMaker.makeGear(this.x, this.y, 1));

        return this;
    }

    /**
     * Create a new generation of parts
     * @returns {Part[]} An array of parts
     */
    reproduce() {
        return [];
    }
}