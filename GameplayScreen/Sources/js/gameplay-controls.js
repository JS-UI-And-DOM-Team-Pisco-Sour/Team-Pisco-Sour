window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 800,
        STAGE_HEIGHT: 600
    };

    var stage, layer;

    function initialize() {
        stage = new Kinetic.Stage({
            container: 'gameplay-container',
            width: CONSTANTS.STAGE_WIDTH,
            height: CONSTANTS.STAGE_HEIGHT
        });

        layer = new Kinetic.Layer();
    }

    function run() {

    }

    (function () {
        initialize();
        run();
    }());
};