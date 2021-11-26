/**
 * A machine part
 */
class Part {
    static CLASS_LAYER = "layer-";

    /**
     * Construct a part
     * @param {number} x The X position on the grid
     * @param {number} y The Y position on the grid
     * @param {number} radius The radius
     */
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.collisionRadius = radius;
    }

    /**
     * Make the element for this part
     * @param {number} layer The layer number starting at zero
     * @param {SVGMaker} svgMaker An SVG maker
     * @param {SVGGElement} group The SVG group to add parts on
     * @returns {Part} This part
     */
    makeElement(layer, svgMaker, group) {
        return this;
    }

    /**
     * Check if a part can be placed amongst other parts without overlap
     * @param {Part[]} others Other parts to avoid
     * @returns {boolean} True if the part can be placed
     */
    fits(others) {
        for (const other of others) {
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const d = other.collisionRadius + this.collisionRadius;

            if (dx * dx + dy * dy < d * d)
                return false;
        }

        return true;
    }

    /**
     * Check if this parts does not overlap other parts too much
     * @param {Part[]} others Other parts to avoid
     * @returns {boolean} True if the part can be placed
     */
    fitsOverlap(others) {
        for (const other of others) {
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const ds = dx * dx + dy * dy;
            const d = Math.max(other.collisionRadius, this.collisionRadius);

            if (ds < d * d)
                return false;
        }

        return true;
    }

    /**
     * Create a new generation of parts
     * @param {Budget} budget A part budget
     * @param {Part[]} newParts The array of new parts for this layer
     * @param {Part[]} allParts The array all parts except the parts in this layer
     */
    reproduce(budget, newParts, allParts) {

    }

    /**
     * Trim unused parts
     * @param {SVGGElement} group The SVG group that contains all parts
     */
    trim(group) {

    }
}