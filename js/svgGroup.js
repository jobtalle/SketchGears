/**
 * An SVG item
 */
class SVGGroup {
    /**
     * Construct the SVG item
     * @param {string} uri The URI
     * @param {SVGGroup} group The SVG group
     * @param {number} x The X coordinate
     * @param {number} y The Y coordinate
     */
    constructor(uri, group, x, y) {
        this.uri = uri;
        this.group = group;
        this.x = x;
        this.y = y;
        this.angle = 0;

        this.updateTransform();
    }

    /**
     * Update the transform for this group
     */
    updateTransform() {
        this.group.setAttribute("transform", "translate(" + this.x.toFixed(4) + "," + this.y.toFixed(4)+ ") rotate(" + this.angle.toFixed(4) + ")");
    }
}