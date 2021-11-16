{
    const machine = new Machine(
        document.getElementById("wrapper").clientWidth,
        document.getElementById("wrapper").clientHeight,
        document.getElementById("content"),
        new Random());

    let lastTime = performance.now();

    const loop = time => {
        machine.update(.001 * (time - lastTime));
        lastTime = time;

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}