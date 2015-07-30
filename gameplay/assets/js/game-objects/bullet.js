define(['./contracts/game-object'],
    function (GameObject) {
        var Bullet = (function (parent) {
            var Bullet = function (imagePath, layer) {
                parent.call(this, imagePath);
                this.layer = layer;
            }
        }(GameObject));

        return Bullet;
    });