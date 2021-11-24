/**
 * A gear
 */
class PartGear extends Part {
    /**
     * Construct a part
     * @param {number} x The X position on the grid
     * @param {number} y The Y position on the grid
     */
    constructor(x, y) {
        super(x, y);

        this.angle = 0;
        this.gear = null;
        this.teeth = 15;

        this.gears = [];
    }

    /**
     * Rotate this gear
     * @param delta
     */
    rotate(delta) {
        this.angle += delta;

        while (this.angle > 360)
            this.angle -= 360;

        while (this.angle < 0)
            this.angle += 360;

        this.gear.angle = this.angle;
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
        this.gear = svgMaker.makeGear(this.x, this.y, 1, this.teeth, .07, .15, 1 - .075 - .15);

        layerMoving.appendChild(this.gear.group);

        return this;
    }

    /**
     * Make a connecting gear
     * @returns {PartGear} A new gear
     */
    reproduceGear() {
        const angle = Math.random() * Math.PI * 2;
        const gear = new PartGear(
            this.x + Math.cos(angle) * 2,
            this.y + Math.sin(angle) * 2);

        this.gears.push(gear);

        return gear;
    }

    /**
     * Create a new generation of parts
     * @returns {Part[]} An array of parts
     */
    reproduce() {
        if (Math.random() < .5)
            return [this.reproduceGear()];

        return super.reproduce();
    }
}