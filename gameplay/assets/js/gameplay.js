window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 800,
        STAGE_HEIGHT: 600,

        PLAYER_WIDTH: 150,
        PLAYER_HEIGHT: 117,

        ENEMY_WIDTH: 99.2,
        ENEMY_HEIGHT: 111
    };

    var gameplayContainer, stage, backgroundLayer, actionLayer,
        backgroundImageObj, playerImageObj, enemyImageObj,
        currentFrame = 0,enemyFrame = 0;

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
                }
            }

            if (e.clientX > playerCenterX) {
                if (Math.abs(e.clientY - playerCenterY) < e.clientX - playerCenterX) {
                    player.setCrop({
                        x: 0, y: 3 * CONSTANTS.PLAYER_HEIGHT, width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            if (e.clientY < playerCenterY) {
                if (Math.abs(e.clientX - playerCenterX) < playerCenterY - e.clientY) {
                    player.setCrop({
                        x: 0, y: 1 * CONSTANTS.PLAYER_HEIGHT, width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            if (e.clientY > playerCenterY) {
                if (Math.abs(e.clientX - playerCenterX) < e.clientY - playerCenterY) {
                    player.setCrop({
                        x: 0, y: 0 * CONSTANTS.PLAYER_HEIGHT, width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }
        });
    }

    function loadEnemy() {
        enemyImageObj = new Image();
        enemyImageObj.src = "assets/images/enemy.png";

        enemyImageObj.onload = function () {
            var enemy = new Kinetic.Image({
                x: (CONSTANTS.STAGE_WIDTH - CONSTANTS.ENEMY_WIDTH) / 2,
                y: (CONSTANTS.STAGE_HEIGHT - CONSTANTS.ENEMY_HEIGHT) / 2,
                image: enemyImageObj,
                width: CONSTANTS.ENEMY_WIDTH,
                height: CONSTANTS.ENEMY_HEIGHT,
                crop: {
                    x: enemyFrame * CONSTANTS.ENEMY_WIDTH,
                    y: 0,
                    width: CONSTANTS.ENEMY_WIDTH,
                    height: CONSTANTS.ENEMY_HEIGHT
                }
            });

            actionLayer.add(enemy);
            stage.add(actionLayer);

            // Note: this IIFE will always be invoked every 100ms
            // We can use it to store the current frame of the game
            // and any change to a game object will be automatically
            // affected onto the action layer, i.e each frame we redraw
            // This behaviour can be easily manipulated

            (function spawnEnemy(){
                setTimeout(function () {
                    requestAnimationFrame(spawnEnemy);

                    enemyFrame += 1;
                    if(enemyFrame === 10) {
                        enemyFrame = 9;
                    }

                    enemy.setCrop({
                        x: enemyFrame * CONSTANTS.ENEMY_WIDTH,
                        y: 0,
                        width: CONSTANTS.ENEMY_WIDTH,
                        height: CONSTANTS.ENEMY_HEIGHT
                    });

                    actionLayer.draw();
                }, 100)
            }());
        };
    }


    function initialize() {
        loadCanvas();

        loadBackground();
        loadPlayer();
        loadEnemy();
    }

    function run() {

    }

    (function () {
        initialize();
        run();
    }());
};