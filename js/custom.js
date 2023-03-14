const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";



function animate(selector) {
    let interval = null;
    var titleElement = document.querySelector(selector);
    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
        titleElement.innerText = titleElement.innerText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return titleElement.dataset.value[index];
                }
                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");
        if (iteration >= titleElement.dataset.value.length) {
            clearInterval(interval);
        }
        iteration += 1 / 6;
    }, 30);
}


window.addEventListener("load", (event) => {
    animate("main > div > h1");
    animate(".logo__text");

    const blob = document.querySelector("#blob");

    window.onpointermove = event => {
        const { clientX, clientY } = event;

        blob.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 3000, fill: "forwards" });
    }
});

