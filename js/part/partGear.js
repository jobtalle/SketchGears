/**
 * A gear
 */
class PartGear extends Part {
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