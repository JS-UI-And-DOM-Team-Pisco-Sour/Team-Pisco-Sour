window.onload = function () {
    function runExplosion(x, y, scale) {
        x = x | 0;
        y = y | 0;
        scale = scale | 2;
        var frameX = 0, frameY = 0;
        var stage = new Kinetic.Stage({
            container: 'pesho',
            width: 600,
            height: 600
        });
        var layer = new Kinetic.FastLayer();
        var image;
        var explosion = new Image();
        image = new Kinetic.Image({
            x: x,
            y: y,
            image: explosion,
            width: 256,
            height: 256,
            crop: {
                x: 0,
                y: 0,
                width: 256,
                height: 256
            }
        });

        layer.add(image);
        stage.add(layer);

        explosion.src = 'explosion.png';
        (function run() {
            image.setX(x);
            image.setY(y);
            image.setCrop({
                x: frameX * 256,
                y: frameY * 256,
                width: 256,
                height: 256
            });
            image.setScale({
                x: scale,
                y: scale
            });

            layer.draw();
            frameX++;
            if (frameX % 8 === 0) {
                frameX = 0;
                frameY++;
            }

            if (frameY === 6) {
                cancelAnimationFrame(mariika);
            }

            var mariika = requestAnimationFrame(run);
        }())
    }

    setInterval(runExplosion, 3000);
};