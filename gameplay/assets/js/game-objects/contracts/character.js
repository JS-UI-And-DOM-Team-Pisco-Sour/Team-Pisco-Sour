define(function () {
    var character = {};
    Object.defineProperties(character, {
        init: {
            value: function (imagePath) {
                this.image = new Image();
                this.image.src = imagePath;
                this.kineticImage = null;

                return this;
            }
        }
    });

    return character;
});