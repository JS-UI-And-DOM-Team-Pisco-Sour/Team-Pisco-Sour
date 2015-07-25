window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 800,
        STAGE_HEIGHT: 600,

        PLAYER_WIDTH: 150,
        PLAYER_HEIGHT: 117
    };

    var gameplayContainer, stage, backgroundLayer, actionLayer,
        backgroundImageObj, playerImageObj;

    // 0: looking down, 1: looking up, 2: looking left, 3: looking right

    function loadCanvas() {
        gameplayContainer = document.getElementById('gameplay-container');
        gameplayContainer.setAttribute('width', CONSTANTS.STAGE_WIDTH);
        gameplayContainer.setAttribute('height', CONSTANTS.STAGE_HEIGHT);

        stage = new Kinetic.Stage({
            container: 'gameplay-container',
            width: CONSTANTS.STAGE_WIDTH,
            height: CONSTANTS.STAGE_HEIGHT
        });

        backgroundLayer = new Kinetic.Layer();
        actionLayer = new Kinetic.Layer();
    }

    function loadPlayer() {
        playerImageObj = new Image();
        playerImageObj.src = "assets/images/player.png";

        playerImageObj.onload = function () {
            var player = new Kinetic.Image({
                x: 0,
                y: 0,
                image: playerImageObj,
                width: CONSTANTS.PLAYER_WIDTH,
                height: CONSTANTS.PLAYER_HEIGHT,
                crop: {
                    x: 0,
                    y: 0,
                    width: CONSTANTS.PLAYER_WIDTH,
                    height: CONSTANTS.PLAYER_HEIGHT
                }
            });

            addMouseEventListener(player);
            actionLayer.add(player);
            stage.add(actionLayer);
        };
    }

    function loadBackground() {
        backgroundImageObj = new Image();
        backgroundImageObj.src = "assets/images/canvas-bg.jpg";

        backgroundImageObj.onload = function () {
            var background = new Kinetic.Image({
                x: 0,
                y: 0,
                image: backgroundImageObj,
                width: CONSTANTS.STAGE_WIDTH,
                height: CONSTANTS.STAGE_HEIGHT
            });

            backgroundLayer.add(background);
            stage.add(backgroundLayer);
        };
    }

    function addMouseEventListener(player) {
        var playerCenterX = player.getX() + CONSTANTS.PLAYER_WIDTH / 2,
            playerCenterY = player.getY() + CONSTANTS.PLAYER_HEIGHT / 2;

        gameplayContainer.addEventListener('mousemove', function (e) {
            if (e.clientX < playerCenterX) {
                if (Math.abs(e.clientY - playerCenterY) < playerCenterX - e.clientX) {
                    player.setCrop({
                        x: 0, y: 2 * CONSTANTS.PLAYER_HEIGHT, width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });

                    actionLayer.draw();
                }
            }

            if (e.clientX > playerCenterX) {
                if (Math.abs(e.clientY - playerCenterY) < e.clientX - playerCenterX) {
                    player.setCrop({
                        x: 0, y: 3 * CONSTANTS.PLAYER_HEIGHT, width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });

                    actionLayer.draw();
                }
            }

            if (e.clientY < playerCenterY) {
                if (Math.abs(e.clientX - playerCenterX) < playerCenterY - e.clientY) {
                    player.setCrop({
                        x: 0, y: 1 * CONSTANTS.PLAYER_HEIGHT, width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });

                    actionLayer.draw();
                }
            }

            if (e.clientY > playerCenterY) {
                if (Math.abs(e.clientX - playerCenterX) < e.clientY - playerCenterY) {
                    player.setCrop({
                        x: 0, y: 0 * CONSTANTS.PLAYER_HEIGHT, width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });

                    actionLayer.draw();
                }
            }
        });
    }

    function spawnEnemy() {

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