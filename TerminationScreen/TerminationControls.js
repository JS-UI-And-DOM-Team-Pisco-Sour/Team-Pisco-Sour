window.onload = function () {

    var terminationScreenContainer,
        wholeDoc,
        stage,
        backgroundLayer,
        backgroundImageObj;

    function loadCanvas() {
        terminationScreenContainer = document.getElementById('terminationScreen-container');
        terminationScreenContainer.setAttribute('width', 1000);
        terminationScreenContainer.setAttribute('height', 600);
        wholeDoc = document.getElementById('body');

        stage = new Kinetic.Stage({
            container: 'terminationScreen-container',
            width: 1000,
            height: 600
        });

        backgroundLayer = new Kinetic.Layer();

    }
    function loadBackground() {
        backgroundImageObj = new Image();

        backgroundImageObj.onload = function () {
            var background = new Kinetic.Image({
                x: 0,
                y: 0,
                image: backgroundImageObj,
                width: 1000,
                height: 600
            });

            backgroundLayer.add(background);
            stage.add(backgroundLayer);
        };

        backgroundImageObj.src = "../gameplay/assets/images/canvas-bg.jpg";
    }
    function initialize() {
        loadCanvas();

        loadBackground();
    }
    (function () {
        initialize();
    }());
    };