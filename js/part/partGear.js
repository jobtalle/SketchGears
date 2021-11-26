/**
 * A gear
 */
class PartGear extends Part {
    static TOOTH_STRIDE = .075;
    static SPACING = 0.02;
    static DEPTH = .15;
    static BEVEL = .07;
    static CHILDREN = new Distribution(2, 7, 1.8);
    static CHILD_TEETH = new Distribution(4, 27, 1.2);
    static HOLE_RADIUS = .1;
    static SECOND_GEAR_CHANCE = .6;

    /**
     * Construct a part
     * @param {number} x The X position on the grid
     * @param {number} y The Y position on the grid
     * @param {number} teeth The number of teeth
     * @param {number} [ratio] The transmission ratio
     * @param {number} [offset] The gear offset in degrees
     * @param {boolean} [isSecondary] True if this gear is secondary
     */
    constructor(
        x,
        y,
        teeth,
        ratio = 1,
        offset = 0,
        isSecondary = false) {
        const radius = PartGear.getRadius(teeth);

        super(x, y, radius + PartGear.DEPTH * .5 + PartGear.SPACING);

        this.angle = 0;
        this.gear = null;
        this.teeth = teeth;
        this.radius = radius;
        this.ratio = ratio;
        this.offset = offset;
        this.isSecondary = isSecondary;

        this.children = [];
        this.secondGear = null;
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

        for (const gear of this.children)
            gear.rotate(-delta * this.ratio);

        this.secondGear?.rotate(delta * this.ratio);
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
            PartGear.HOLE_RADIUS);

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
        const teeth = Math.round(PartGear.CHILD_TEETH.evaluate(Math.random()));
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
        if (!this.isSecondary &&
            budget.parts !== 0 &&
            this.teeth * 2 <= PartGear.CHILD_TEETH.max &&
            Math.random() < PartGear.SECOND_GEAR_CHANCE) {
            const gear = new PartGear(this.x, this.y, this.teeth * 2, 1, 0, true);

            if (gear.x * gear.x + gear.y * gear.y < budget.radius * budget.radius &&
                gear.fits(newParts)) {
                this.secondGear = gear;

                newParts.push(gear);

                --budget.parts;
            }
        }
        else {
            const gearCount = Math.min(budget.parts, PartGear.CHILDREN.evaluate(Math.random()));

            for (let i = 0; i < gearCount; ++i) {
                const gear = this.reproduceGear();

                if (gear.x * gear.x + gear.y * gear.y < budget.radius * budget.radius &&
                    gear.fits(newParts) &&
                    gear.fitsOverlap(allParts)) {
                    this.children.push(gear);

                    newParts.push(gear);

                    --budget.parts;
                }
            }
        }
    }


    /**
     * Trim unused parts
     * @param {SVGGElement} group The SVG group that contains all parts
     */
    trim(group) {
        if (this.isSecondary && this.children.length === 0)
            group.removeChild(this.gear.group);
    }
}