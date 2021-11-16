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
     * Make a gear
     * @returns {SVGElement} The SVG element
     */
    makeGear(x, y) {
        const element = document.createElementNS(this.uri, "circle");

        element.setAttribute("cx", "0");
        element.setAttribute("cy", "0");
        element.setAttribute("r", ".8");

        return element;
    }
}