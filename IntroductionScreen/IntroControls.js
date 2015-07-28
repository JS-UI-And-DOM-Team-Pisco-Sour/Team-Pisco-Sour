function togglediv(id) {
    var div = document.getElementById(id),
        gameControls = document.getElementById("game-controls"),
        playButton = document.getElementById("playButton"),
        buttonSound = new Audio('audio/buttonClick.mp3');

    buttonSound.play();
    div.style.display = div.style.display == "none" ? "block" : "none";
    gameControls.style.visibility =  gameControls.style.visibility == "visible" ? "hidden" : "visible";
}

function storeHeroName(id){
        var input = window.document.getElementById(id).value;
        if (input == '' || input == 'undefined') {
            throw new Error("Player name is undefined or null");
        }
        else {
            sessionStorage.setItem('heroName', input);
        }

    }

