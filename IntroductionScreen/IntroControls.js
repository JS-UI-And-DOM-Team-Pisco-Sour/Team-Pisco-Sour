function togglediv(id) {
    var div = document.getElementById(id),
        gameControls = document.getElementById("game-controls"),
        playButton = document.getElementById("playButton"),
        buttonSound = new Audio('audio/buttonClick.mp3');

    buttonSound.play();
    div.style.display = div.style.display == "none" ? "block" : "none";
    gameControls.style.visibility =  gameControls.style.visibility == "visible" ? "hidden" : "visible";
}