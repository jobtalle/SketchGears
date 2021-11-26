/**
 * A machine part
 */
class Part {
    /**
     * Construct a part
     * @param {number} x The X position on the grid
     * @param {number} y The Y position on the grid
     * @param {number} radius The radius
     */
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    /**
     * Make the element for this part
     * @param {SVGMaker} svgMaker An SVG maker
     * @param {SVGGElement} layerMoving The moving parts layer
     * @param {SVGGElement} layerForeground The foreground layer
     * @returns {Part} This part
     */
    makeElement(svgMaker, layerMoving, layerForeground) {
        return this;
    }

    /**
     * Check if a part can be placed amongst other parts without overlap
     * @param {Part} part The part to place
     * @param {Part[]} others Other parts to avoid
     * @returns {boolean} True if the part can be placed
     */
    fits(part, others) {
        for (const other of others) {
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const r = other.radius + this.radius;

            if (dx * dx + dy * dy < r * r)
                return false;
        }

        return true;
    }

    /**
     * Create a new generation of parts
     * @param {Budget} budget A part budget
     * @param {Part[]} others Other parts to avoid
     * @returns {Part[]} An array of parts
     */
    reproduce(budget, others) {
        return [];
    }
}