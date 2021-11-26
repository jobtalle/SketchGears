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

        this.root = new PartGear(0, 0, 16);

        let levels = 3;
        let layer = 0;
        let budget = new Budget(8);
        let open = [this.root];
        const all = [...open];

        while (open.length > 0 && levels !== 0) {
            const nextParts = [];
            let part = null;

            for (const part of open)
                part.makeElement(layer, svgMaker, layerMoving, layerForeground);

            while (part = open.pop())
                part.reproduce(budget, nextParts, all);

            if (--levels === 0) {
                for (const part of nextParts)
                    part.makeElement(layer + 1, svgMaker, layerMoving, layerForeground);
            }
            else {
                open = nextParts;
                all.push(...nextParts);

                ++layer;
            }
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