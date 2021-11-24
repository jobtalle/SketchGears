/**
 * A machine
 */
class Machine {
    /**
     * Construct a machine
     * @param {number} width The width in pixels
     * @param {number} height The height in pixels
     * @param {SVGSVGElement} svg The SVG element to create items on
     * @param {Random} random A randomizer
     */
    constructor(width, height, svg, random) {
        const scale = 80;
        const uri = svg.getAttribute("xmlns");
        const svgMaker = new SVGMaker(uri);
        const layerContainer = document.createElementNS(uri, "g");
        const layerMoving = document.createElementNS(uri, "g");
        const layerForeground = document.createElementNS(uri, "g");

        this.root = new PartGear(0, 0);

        let open = [this.root];

        while (open.length > 0) {
            const nextParts = [];
            let part = null;

            for (const part of open)
                part.makeElement(svgMaker, layerMoving, layerForeground);

            while (part = open.pop())
                nextParts.push(...part.reproduce());

            open = nextParts;
        }

        layerContainer.setAttribute("transform",
            "translate(" +
            (width * .5).toString() + "," +
            (height * .5).toString() + ")" +
            "scale(" + scale.toString() + ")");
        layerContainer.appendChild(layerMoving);
        layerContainer.appendChild(layerForeground);
        svg.appendChild(layerContainer);
    }

    /**
     * Update the machine
     * @param {number} dt The time delta in seconds
     */
    update(dt) {
        this.root.rotate(80 * dt);
    }
}