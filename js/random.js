/**
 * A randomizer
 */
class Random {
    static MULTIPLIER = 69069;
    static MODULUS = 2 ** 32;
    static INCREMENT = 1;

    /**
     * Make a random seed
     * @returns {number} A valid random seed
     */
    static makeSeed() {
        return Math.floor(fxrand() * Random.MODULUS);
    }

    /**
     * Construct a randomizer
     * @param {number} seed The seed, which must be a 32-bit unsigned integer
     */
    constructor(seed = Random.makeSeed()) {
        this.n = seed;
    }

    /**
     * Get a randomized number in the range [0, 1]
     * @returns {number} A random number
     */
    get float() {
        this.n = (Random.MULTIPLIER * this.n + Random.INCREMENT) % Random.MODULUS;

        return this.n / Random.MODULUS;
    }
}