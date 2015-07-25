window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 800,
        STAGE_HEIGHT: 600
    };

    var stage, layer, backgroundImageObj, playerImageObj;

    function loadCanvas() {
        var container = document.getElementById('gameplay-container');
        container.position =
        stage = new Kinetic.Stage({
            container: 'gameplay-container',
            width: CONSTANTS.STAGE_WIDTH,
            height: CONSTANTS.STAGE_HEIGHT
        });

        layer = new Kinetic.Layer();
    }

    function loadPlayer() {

    }

    function loadBackground() {
        backgroundImageObj = new Image();
        backgroundImageObj.src = "sources/images/canvas-bg.jpg";

        backgroundImageObj.onload = function () {
            var background = new Kinetic.Image({
                x: 0,
                y: 0,
                image: backgroundImageObj,
                width: CONSTANTS.STAGE_WIDTH,
                height: CONSTANTS.STAGE_HEIGHT
            });

            layer.add(background);
            stage.add(layer);
        };
    }

    function initialize() {
        loadCanvas();

        loadBackground();
        loadPlayer();
    }

    function run() {

    }

    (function () {
        initialize();
        run();
    }());
};