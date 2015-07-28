function showHighScores(){
    var counter=1;
    document.getElementById("high-scores").innerHTML = counter +'. '+ sessionStorage.getItem('heroName');
    document.getElementById("GameOver").style.display='none';
    counter++;
}