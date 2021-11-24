/**
 * A gear
 */
class PartGear extends Part {
    static TOOTH_STRIDE = .075;

    /**
     * Construct a part
     * @param {number} x The X position on the grid
     * @param {number} y The Y position on the grid
     * @param {number} teeth The number of teeth
     * @param {number} [ratio] The transmission ratio
     * @param {number} [offset] The gear offset in degrees
     */
    constructor(x, y, teeth, ratio = 1, offset = 0) {
        super(x, y);

        this.angle = 0;
        this.gear = null;
        this.teeth = teeth;
        this.radius = PartGear.getRadius(teeth);
        this.ratio = ratio;
        this.offset = offset;

        this.gears = [];
    }

    /**
     * Calculate the gear radius for a given number of teeth
     * @param {number} teeth The number of teeth
     * @returns {number} The radius
     */
    static getRadius(teeth) {
        return teeth * PartGear.TOOTH_STRIDE;
    }

    /**
     * Rotate this gear
     * @param delta
     */
    rotate(delta) {
        this.angle += delta * this.ratio;

        while (this.angle > 360)
            this.angle -= 360;

        while (this.angle < 0)
            this.angle += 360;

        this.gear.angle = this.angle + this.offset;
        this.gear.updateTransform();

        for (const gear of this.gears)
            gear.rotate(-delta);
    }

    /**
     * Make the element for this part
     * @param {SVGMaker} svgMaker An SVG maker
     * @param {SVGGElement} layerMoving The moving parts layer
     * @param {SVGGElement} layerForeground The foreground layer
     * @returns {Part} This part
     */
    makeElement(svgMaker, layerMoving, layerForeground) {
        this.gear = svgMaker.makeGear(this.x, this.y, this.radius, this.teeth, .07, .15, this.radius - .075 - .15);

        layerMoving.appendChild(this.gear.group);

        return this;
    }

    /**
     * Make a connecting gear
     * @returns {PartGear} A new gear
     */
    reproduceGear() {
        const angle = Math.random() * Math.PI * 2;
        const teeth = Math.round(6 + Math.random() * 12);
        const radius = PartGear.getRadius(teeth);
        const gear = new PartGear(
            this.x + Math.cos(angle) * (this.radius + radius),
            this.y + Math.sin(angle) * (this.radius + radius),
            teeth,
            this.ratio * (this.teeth / teeth),
            this.offset);

        this.gears.push(gear);

        return gear;
    }

    /**
     * Create a new generation of parts
     * @param {Budget} budget A part budget
     * @returns {Part[]} An array of parts
     */
    reproduce(budget) {
        const gearCount = Math.min(Math.round(Math.random() * .3 + 1), budget.parts);
        const parts = [];

        for (let i = 0; i < gearCount; ++i)
            parts.push(this.reproduceGear());

        budget.parts -= gearCount;

        return parts;
    }
}