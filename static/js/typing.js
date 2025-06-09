document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.typing');
    const professions = ["CTO", "ENGINEERING MANAGER", "TECHNICAL DIRECTOR", "PROGRAM MANAGER"];
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 300;

    function type() {
        const currentProfession = professions[professionIndex];
        if (isDeleting) {
            typingElement.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentProfession.length) {
            isDeleting = true;
            typingDelay = 1000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typingDelay = 200;
        }

        setTimeout(type, isDeleting ? 100 : typingDelay);
    }

    type();
});