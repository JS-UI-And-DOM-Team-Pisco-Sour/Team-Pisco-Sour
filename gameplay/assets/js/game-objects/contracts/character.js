define(function () {
    var Character = (function(){
        var Character = function(imagePath){
            this.image = new Image();
            this.image.src = imagePath;
            this.kineticImage = null;
        };

        return Character;
    }());

    return Character;
});