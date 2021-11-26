/**
 * A machine
 */
class Machine {
    static MAIN_SPEED = 50;
    static SCALE = 12;
    static LAYERS = 7;
    static MOUSE_SPEED = .003;
    static MIN_PARTS = 16;
    static MAX_PARTS = 40;
    static RADIUS = 4.7;
    static ROOT_TEETH = 20;

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

        this.root = new PartGear(0, 0, Machine.ROOT_TEETH);
        this.sign = random.float < .5 ? -1 : 1;
        this.dragging = false;

        let group = this.create(svgMaker);
        let mx = 0;

        while (group.childElementCount < Machine.MIN_PARTS)
            group = this.create(svgMaker);

        group.setAttribute("transform",
            "translate(" +
            (width * .5).toString() + "," +
            (height * .5).toString() + ")" +
            "scale(" + scale.toString() + ")");
        svg.appendChild(group);

        svg.addEventListener("mousedown", event => {
            mx = event.clientX;

            this.dragging = true;
        });

        svg.addEventListener("mousemove", event => {
            if (this.dragging) {
                const dx = event.clientX - mx;

                if (dx !== 0) {
                    this.sign = Math.sign(dx);
                    this.root.rotate(Machine.MOUSE_SPEED * Machine.MAIN_SPEED * dx);

                    mx = event.clientX;
                }
            }
        });

        svg.addEventListener("mouseup", () => {
            this.dragging = false;
        });
    }

    /**
     * Create a machine
     * @param {SVGMaker} svgMaker An SVG maker
     * @returns {SVGGElement} The SVG group element
     */
    create(svgMaker) {
        let levels = Machine.LAYERS - 1;
        let layer = 0;
        let budget = new Budget(Machine.MAX_PARTS, Machine.RADIUS);
        let open = [this.root];
        const all = [...open];
        const group = document.createElementNS(svgMaker.uri, "g");
        const random = new Random();

        while (open.length > 0 && levels !== 0) {
            const nextParts = [];
            let part = null;

            for (const part of open)
                part.makeElement(layer, svgMaker, group);

            while (budget.parts !== 0 && (part = open.pop()))
                part.reproduce(budget, random, nextParts, all);

            if (--levels === 0) {
                for (const part of nextParts)
                    part.makeElement(layer + 1, svgMaker, group);
            }
            else {
                open = nextParts;

                ++layer;
            }

            all.push(...nextParts);
        }

        for (const part of all)
            part.trim(group);

        return group;
    }

    /**
     * Update the machine
     * @param {number} dt The time delta in seconds
     */
    update(dt) {
        if (!this.dragging)
            this.root.rotate(Machine.MAIN_SPEED * dt * this.sign);
    }
}