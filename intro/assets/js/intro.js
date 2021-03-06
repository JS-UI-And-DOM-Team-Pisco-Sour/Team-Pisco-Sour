function togglediv(id) {
    var div = document.getElementById(id),
        gameControls = document.getElementById("game-controls"),
        buttonSound = new Audio('assets/audio/buttonClick.mp3');

    buttonSound.play();
    div.style.display = div.style.display === "none" ? "block" : "none";
    gameControls.style.display = gameControls.style.display === "block" ? "none" : "block";
}

function storeHeroName(id) {
    var input = window.document.getElementById(id).value;
    if (input === '' || input === 'undefined') {
        throw new Error("Player name is undefined or null");
    }
    else {
        sessionStorage.setItem('heroName', input);
    }

    window.location.href = "../gameplay/gameplay.html";
}

