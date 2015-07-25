window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 800,
        STAGE_HEIGHT: 600
    };

    var stage, layer
        player = {
            image: new Image(),
            x: 0,
            y: 0
        };

    function loadCanvas() {
        stage = new Kinetic.Stage({
            container: 'gameplay-container',
            width: CONSTANTS.STAGE_WIDTH,
            height: CONSTANTS.STAGE_HEIGHT
        });

        layer = new Kinetic.Layer();
    }

    function loadPlayer() {
        player.image.src = "";
    }

    function initialize() {
        loadCanvas();
        loadPlayer();
    }

    function run() {

    }

    (function () {
        initialize();
        run();
    }());
};