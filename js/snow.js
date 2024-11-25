document.getElementById('letitsnow').addEventListener('click', () => {
    startSnow();
    playSong();
});

function startSnow() {
    const body = document.body;
    const snowInterval = setInterval(() => {
        const snowflake = document.createElement('div');
        const size = Math.random() * 10 + 10; // Taille aléatoire
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.position = 'absolute';
        snowflake.style.top = '-20px';
        snowflake.style.left = `${Math.random() * window.innerWidth}px`;
        snowflake.style.backgroundColor = 'white';
        snowflake.style.borderRadius = '50%';
        snowflake.style.opacity = Math.random();
        snowflake.style.zIndex = '9999'; //Pour qu'ils soient devant tout
        const duration = Math.random() * 3 + 2;
        snowflake.style.transition = `top ${duration}s linear, left ${duration}s ease-in-out`; //Durée aléatoire de l'animation
        body.appendChild(snowflake);

        // Démarre la chute
        setTimeout(() => {
            snowflake.style.top = `${window.innerHeight}px`;
            snowflake.style.left = `${parseInt(snowflake.style.left) + Math.random() * 50 - 25}px`;
        }, 50);

        // Supprime les flocons après qu'ils aient disparu
        setTimeout(() => snowflake.remove(), duration * 1000);
    }, 200);

    // Arrêter après 30 secondes (facultatif)
    setTimeout(() => clearInterval(snowInterval), 30000);
}

// Fonction pour jouer la chanson
function playSong() {
    const audio = new Audio('./audio/we-wish-you-a-merry-christmas-happy-remix-background-intro-theme-265842.mp3');
    audio.play();
}
