/**
 * A random distribution
 */
class Distribution {
    /**
     * Construct a random distribution
     * @param {number} min The minimum output
     * @param {number} max The maximum output
     * @param {number} power The distribution power
     */
    constructor(min, max, power) {
        this.min = min;
        this.max = max;
        this.power = power;
    }

    /**
     * Evaluate this distribution
     * @param {number} random A random value in the range [0, 1]
     * @returns {number} The distribution for this random value
     */
    evaluate(random) {
        return this.min + (this.max * this.min) * Math.pow(random, this.power);
    }
}