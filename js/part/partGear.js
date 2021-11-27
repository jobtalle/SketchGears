/**
 * A gear
 */
class PartGear extends Part {
    static TOOTH_STRIDE = .075;
    static SPACING = 0.02;
    static DEPTH = .15;
    static BEVEL = .07;
    static CHILDREN = new Distribution(3, 19, 1.4);
    static CHILD_TEETH = new Distribution(5, 22, 1.2);
    static HOLE_RADIUS = .1;
    static SECOND_GEAR_CHANCE = .6;
    static SECOND_GEAR_SCALE = new Distribution(1.7, 3.5, 1.5);
    static RADIUS_FALLOFF = 1;

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
     * @param {Random} random A randomizer
     * @param {number} distanceFactor A factor in the range [0, 1] depending on the distance to the center
     * @returns {PartGear} A new gear
     */
    reproduceGear(random, distanceFactor) {
        const angleOffset = random.float;
        const angle = angleOffset * Math.PI * 2;
        const teeth = Math.round(PartGear.CHILD_TEETH.evaluate(random.float * Math.sqrt(distanceFactor)));
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
     * @param {Random} random A randomizer
     * @param {Part[]} newParts The array of new parts for this layer
     * @param {Part[]} allParts The array all parts except the parts in this layer
     */
    reproduce(budget, random, newParts, allParts) {
        if (!this.isSecondary &&
            budget.parts !== 0 &&
            random.float < PartGear.SECOND_GEAR_CHANCE) {
            const secondGearTeeth = Math.round(this.teeth * PartGear.SECOND_GEAR_SCALE.evaluate(random.float));

            if (secondGearTeeth < PartGear.CHILD_TEETH.max) {
                const gear = new PartGear(this.x, this.y, secondGearTeeth, 1, 0, true);

                if (gear.x * gear.x + gear.y * gear.y < budget.radius * budget.radius &&
                    gear.fits(newParts)) {
                    this.secondGear = gear;

                    newParts.push(gear);

                    --budget.parts;
                }
            }
        }
        else {
            const gearCount = Math.min(budget.parts, PartGear.CHILDREN.evaluate(random.float));

            for (let i = 0; i < gearCount; ++i) {
                const gear = this.reproduceGear(
                    random,
                    1 - PartGear.RADIUS_FALLOFF *
                        Math.sqrt(this.x * this.x + this.y * this.y) / budget.radius);

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
        if (this.secondGear && this.secondGear.children.length === 0) {
            group.removeChild(this.secondGear.gear.group);

            this.secondGear = null;
        }
    }
}