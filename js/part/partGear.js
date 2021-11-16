/**
 * A gear
 */
class PartGear extends Part {
    static SPEED = 80;

    /**
     * Construct a part
     * @param {number} x The X position on the grid
     * @param {number} y The Y position on the grid
     */
    constructor(x, y) {
        super(x, y);

        this.angle = 0;
        this.gear = null;
    }

    /**
     * Update the part
     * @param {number} dt The time delta in seconds
     */
    update(dt) {
        const delta = dt * PartGear.SPEED;

        this.angle += delta;

        while (this.angle > 360)
            this.angle -= 360;

        while (this.angle < 0)
            this.angle += 360;

        this.gear.angle = this.angle;
        this.gear.updateTransform();
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
        this.gear = svgMaker.makeGear(x, y, 1);

        layerMoving.appendChild(this.gear.group);

        return this;
    }
}