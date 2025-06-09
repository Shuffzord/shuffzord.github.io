const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";



function animate(selector) {
    let interval = null;
    var element = document.querySelector(selector);
    if (element !== null) {
        let iteration = 0;
        clearInterval(interval);
        interval = setInterval(() => {
            element.innerText = element.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return element.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");
            if (iteration >= element.dataset.value.length) {
                clearInterval(interval);
            }
            iteration += 1 / 6;
        }, 30);
    }
}


// Mandala effect does not require mousemove animation

