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
     * @returns {SVGElement} The SVG element
     */
    makeGear(x, y) {
        const group = this.makePartGroup(x, y);
        const element = document.createElementNS(this.uri, "circle");

        element.setAttribute("cx", "0");
        element.setAttribute("cy", "0");
        element.setAttribute("r", "1");

        group.appendChild(element);

        return group;
    }
}