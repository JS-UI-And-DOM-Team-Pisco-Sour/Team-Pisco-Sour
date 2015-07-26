window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 1100,
        STAGE_HEIGHT: 860,

        PLAYER_WIDTH: 150,
        PLAYER_HEIGHT: 117,
        FACING_DIRECTION: {
            DOWN: 0,
            UP: 1,

            LEFT: 2,
            RIGHT: 3,

            UP_LEFT: 4,
            UP_RIGHT: 5,

            DOWN_LEFT: 6,
            DOWN_RIGHT: 7
        },

        ENEMY_WIDTH: 99.2,
        ENEMY_HEIGHT: 111,
        ENEMY_FRAME_COUNT: 10
    };

    var gameplayContainer,
        stage,
        backgroundLayer,
        actionLayer,
        backgroundImageObj,
        player,
        playerCenterX,
        playerCenterY,
        playerImageObj,
        enemyImageObj,
        currentFrame = 0,
        enemyFrame = 0;


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
            var playerKineticImage = new Kinetic.Image({
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

            player = {
                facingDirection: CONSTANTS.FACING_DIRECTION.RIGHT,
                kineticImage: playerKineticImage
            };

            addMouseEventListener(player.kineticImage);
            actionLayer.add(player.kineticImage);
            stage.add(actionLayer);
        };
    }

    function loadBackground() {
        backgroundImageObj = new Image();
        backgroundImageObj.src = "assets/images/canvas-bckg.jpg";

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

    // 0: looking down, 1: looking up, 2: looking left, 3: looking right

    function addMouseEventListener(playerKineticImage) {
        playerCenterX = playerKineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2;
        playerCenterY = playerKineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2;

        gameplayContainer.addEventListener('mousemove', function (e) {
            if (e.clientX < playerCenterX) {
                if (Math.abs(e.clientY - playerCenterY) < playerCenterX - e.clientX) {
                    playerKineticImage.setCrop({
                        x: 0,
                        y: CONSTANTS.FACING_DIRECTION.LEFT * CONSTANTS.PLAYER_HEIGHT,
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            if (e.clientX > playerCenterX) {
                if (Math.abs(e.clientY - playerCenterY) < e.clientX - playerCenterX) {
                    playerKineticImage.setCrop({
                        x: 0,
                        y: CONSTANTS.FACING_DIRECTION.RIGHT * CONSTANTS.PLAYER_HEIGHT,
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            if (e.clientY < playerCenterY) {
                if (Math.abs(e.clientX - playerCenterX) < playerCenterY - e.clientY) {
                    playerKineticImage.setCrop({
                        x: 0,
                        y: CONSTANTS.FACING_DIRECTION.UP * CONSTANTS.PLAYER_HEIGHT,
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            if (e.clientY > playerCenterY) {
                if (Math.abs(e.clientX - playerCenterX) < e.clientY - playerCenterY) {
                    playerKineticImage.setCrop({
                        x: 0,
                        y: CONSTANTS.FACING_DIRECTION.DOWN * CONSTANTS.PLAYER_HEIGHT,
                        width: CONSTANTS.PLAYER_WIDTH,
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

                    currentFrame += 1;

                    if(enemyFrame < CONSTANTS.ENEMY_FRAME_COUNT - 1) {
                        enemyFrame += 1;
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