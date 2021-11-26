/**
 * A machine
 */
class Machine {
    static MAIN_SPEED = 50;
    static SCALE = 12;

    /**
     * Construct a machine
     * @param {number} width The width in pixels
     * @param {number} height The height in pixels
     * @param {SVGSVGElement} svg The SVG element to create items on
     * @param {Random} random A randomizer
     */
    constructor(width, height, svg, random) {
        const scale = Math.min(width, height) / Machine.SCALE;
        const uri = svg.getAttribute("xmlns");
        const svgMaker = new SVGMaker(uri);
        const group = document.createElementNS(uri, "g");

        this.root = new PartGear(0, 0, 20);

        let levels = 3;
        let layer = 0;
        let budget = new Budget(17, 5);
        let open = [this.root];
        const all = [...open];

        while (open.length > 0 && levels !== 0) {
            const nextParts = [];
            let part = null;

            for (const part of open)
                part.makeElement(layer, svgMaker, group);

            while (part = open.pop())
                part.reproduce(budget, nextParts, all);

            if (--levels === 0) {
                for (const part of nextParts)
                    part.makeElement(layer + 1, svgMaker, group);
            }
            else {
                open = nextParts;
                all.push(...nextParts);

                ++layer;
            }
        }

        group.setAttribute("transform",
            "translate(" +
            (width * .5).toString() + "," +
            (height * .5).toString() + ")" +
            "scale(" + scale.toString() + ")");
        svg.appendChild(group);
    }

    /**
     * Update the machine
     * @param {number} dt The time delta in seconds
     */
    update(dt) {
        this.root.rotate(Machine.MAIN_SPEED * dt);
    }
}