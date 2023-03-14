const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let interval = null;

window.addEventListener("load", (event) => {
    var titleElement = document.querySelector("main > div > h1");
    let iteration = 0;

    clearInterval(interval);

    interval = setInterval(() => {
        titleElement.innerText = titleElement.innerText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return titleElement.dataset.value[index];
                }

                return letters[Math.floor(Math.random() * 26)]
            })
            .join("");

        if (iteration >= titleElement.dataset.value.length) {
            clearInterval(interval);
        }

        iteration += 1 / 6;
    }, 30);

    var logoElement = document.querySelector(".logo__text");
    let logoInterval = 0;

    clearInterval(logoInterval);

    logoInterval = setInterval(() => {
        logoElement.innerText = logoElement.innerText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return logoElement.dataset.value[index];
                }

                return letters[Math.floor(Math.random() * 26)]
            })
            .join("");

        if (iteration >= logoElement.dataset.value.length) {
            clearInterval(logoInterval);
        }

        iteration += 1 / 6;
    }, 30);
});
