define(['./contracts/game-object'],
    function (GameObject) {
        var Bullet = (function (parent) {
            var Bullet = function (x, y, imagePath) {
                parent.call(this, imagePath);
                this.kineticImage = new Kinetic.Image({
                    x: x,
                    y: y,
                    image: this.image,
                    width: 28,
                    height: 28,
                    crop: {
                        x: 0,
                        y: 0,
                        width: 128,
                        height: 128
                    }
                });
            };

            return Bullet;
        }(GameObject));

        return Bullet;
    });