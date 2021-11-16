/**
 * SVG part maker
 */
class SVGMaker {
    /**
     * Construct an SVG maker
     * @param {string} uri The SVG URI
     */
    constructor(uri) {
        this.uri = uri;
    }

    /**
     * Make a part group
     * @param {number} x The world X coordinate
     * @param {number} y The world Y coordinate
     */
    makePartGroup(x, y) {
        const element = document.createElementNS(this.uri, "g");

        element.setAttribute("transform", "translate(" + x.toString() + "," + y.toString() + ")");

        return element;
    }

    /**
     * Make a gear
     * @param {number} x The world X coordinate
     * @param {number} y The world Y coordinate
     * @param {number} radius The gear radius
     * @returns {SVGElement} The SVG element
     */
    makeGear(x, y, radius) {
        const group = this.makePartGroup(x, y);
        const element = document.createElementNS(this.uri, "path");
        const teeth = 10;
        const radiusInner = radius - .1;
        const radiusOuter = radius + .1;
        const bevel = 0.07;
        let path = "M " +
            (Math.cos(Math.PI * 2 * (teeth - bevel)) * radiusInner).toFixed(4) + "," +
            (Math.sin(Math.PI * 2 * (teeth - bevel)) * radiusInner).toFixed(4) + " ";

        for (let tooth = 0; tooth < teeth; ++tooth) {
            const a0 = Math.PI * 2 * (tooth + .5 - bevel) / teeth;
            const a1 = Math.PI * 2 * (tooth + .5 + bevel) / teeth;
            const a2 = Math.PI * 2 * (tooth + 1 - bevel) / teeth;
            const a3 = Math.PI * 2 * (tooth + 1 + bevel) / teeth;

            path += "A " +
                radiusInner.toFixed(4) + "," +
                radiusInner.toFixed(4) + " " +
                "0 0 1 " +
                (Math.cos(a0) * radiusInner).toFixed(4) + "," +
                (Math.sin(a0) * radiusInner).toFixed(4) + " ";
            path += "L " +
                (Math.cos(a1) * radiusOuter).toFixed(4) + "," +
                (Math.sin(a1) * radiusOuter).toFixed(4) + " ";
            path += "A " +
                radiusOuter.toFixed(4) + "," +
                radiusOuter.toFixed(4) + " " +
                "0 0 1 " +
                (Math.cos(a2) * radiusOuter).toFixed(4) + "," +
                (Math.sin(a2) * radiusOuter).toFixed(4) + " ";
            path += "L " +
                (Math.cos(a3) * radiusInner).toFixed(4) + "," +
                (Math.sin(a3) * radiusInner).toFixed(4) + " ";
        }

        element.setAttributeNS(null, "d", path + "Z");

        group.appendChild(element);

        return group;
    }
}