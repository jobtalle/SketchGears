/**
 * A gear
 */
class PartGear extends Part {
    static TOOTH_STRIDE = .075;
    static SPACING = 0.02;
    static DEPTH = .15;
    static BEVEL = .07;

    /**
     * Construct a part
     * @param {number} x The X position on the grid
     * @param {number} y The Y position on the grid
     * @param {number} teeth The number of teeth
     * @param {number} [ratio] The transmission ratio
     * @param {number} [offset] The gear offset in degrees
     */
    constructor(x, y, teeth, ratio = 1, offset = 0) {
        const radius = PartGear.getRadius(teeth);

        super(x, y, radius + PartGear.DEPTH * .5 + PartGear.SPACING);

        this.angle = 0;
        this.gear = null;
        this.teeth = teeth;
        this.radius = radius;
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
            gear.rotate(-delta * this.ratio);
    }

    /**
     * Make the element for this part
     * @param {number} layer The layer number starting at zero
     * @param {SVGMaker} svgMaker An SVG maker
     * @param {SVGGElement} group The SVG group to add parts on
     * @returns {Part} This part
     */
    makeElement(layer, svgMaker, group) {
        this.gear = svgMaker.makeGear(
            this.x,
            this.y,
            this.radius,
            this.teeth,
            PartGear.BEVEL,
            PartGear.DEPTH,
            .1);

        svgMaker.setClass(this.gear.group, Part.CLASS_LAYER + layer.toString())

        group.insertBefore(this.gear.group, group.children[0]);

        return this;
    }

    /**
     * Make a connecting gear
     * @returns {PartGear} A new gear
     */
    reproduceGear() {
        const angleOffset = Math.random();
        const angle = angleOffset * Math.PI * 2;
        const teeth = Math.round(4 + Math.random() * 20);
        const radius = PartGear.getRadius(teeth);
        const ratio = this.teeth / teeth;
        const toothOffset = (teeth & 1) * 180 / teeth;
        return new PartGear(
            this.x + Math.cos(angle) * (this.radius + radius + PartGear.SPACING),
            this.y + Math.sin(angle) * (this.radius + radius + PartGear.SPACING),
            teeth,
            ratio,
            angleOffset * 360 + angleOffset * ratio * 360 + toothOffset - this.offset * ratio);
    }

    /**
     * Create a new generation of parts
     * @param {Budget} budget A part budget
     * @param {Part[]} newParts The array of new parts for this layer
     * @param {Part[]} allParts The array all parts except the parts in this layer
     */
    reproduce(budget, newParts, allParts) {
        const gearCount = Math.min(Math.round(Math.random() * 2 + 1), budget.parts);

        for (let i = 0; i < gearCount; ++i) {
            const gear = this.reproduceGear();

            if (gear.fits(newParts) && gear.fitsOverlap(allParts)) {
                this.gears.push(gear);

                newParts.push(gear);

                --budget.parts;
            }
        }
    }
}