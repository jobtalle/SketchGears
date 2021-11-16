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
     * Update the part
     * @param {number} dt The time delta in seconds
     */
    update(dt) {

    }

    /**
     * Make the element for this part
     * @param {SVGMaker} svgMaker An SVG maker
     * @param {number} x The X position
     * @param {number} y The Y position
     * @param {SVGGElement} layerMoving The moving parts layer
     * @param {SVGGElement} layerForeground The foreground layer
     * @returns {Part} This part
     */
    makeElement(svgMaker, x, y, layerMoving, layerForeground) {
        layerMoving.appendChild(svgMaker.makeGear(x, y, 1));

        return this;
    }
}