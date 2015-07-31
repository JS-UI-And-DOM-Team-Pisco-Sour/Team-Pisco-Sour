window.onload = function () {
    var pesho = document.getElementById("scores");
    pesho.innerHTML += ('<h6>Your score</h6>' + '<p>' + sessionStorage.getItem('heroName') + '&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;' + sessionStorage.getItem('playerScore') + '</p>');
    pesho.innerHTML += ('<h6>Highest score</h6>' + '<p>' + localStorage.getItem('highScorerName') + '&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;' + localStorage.getItem('highestScore') + '</p>');
};