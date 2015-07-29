function showHighScores(){
document.getElementById('high-scores').style.display='block';
    document.getElementById("currentScore").innerHTML =sessionStorage.getItem('heroName')+'&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;'+sessionStorage.playerScore;
    document.getElementById("highestScore").innerHTML =localStorage.highScorerName + '&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;'+localStorage.highestScore;
        document.getElementById("GameOver").style.display='none';
}