window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 1100,
        STAGE_HEIGHT: 860,

        PLAYER_WIDTH: 155,
        PLAYER_HEIGHT: 160,
        FACING_DIRECTIONS: {
            UP: 2,
            DOWN: 6,

            LEFT: 0,
            RIGHT: 4,

            UP_LEFT: 7,
            UP_RIGHT: 5,

            DOWN_LEFT: 1,
            DOWN_RIGHT: 3
        },

        ENEMY_WIDTH: 99.2,
        ENEMY_HEIGHT: 111,
        ENEMY_FRAME_COUNT: 10
    };

<<<<<<< HEAD
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
=======
    var gameplayContainer, stage, backgroundLayer, actionLayer,
        backgroundImageObj, playerImageObj, enemyImageObj,
        currentFrame = 0, enemyFrame = 0;
>>>>>>> 2e62ba9d5e4ca57eb7f1cea84684db787d2a1f78


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
        playerImageObj.src = "assets/images/shooter-sprite.png";

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

<<<<<<< HEAD
    // 0: looking down, 1: looking up, 2: looking left, 3: looking right

    function addMouseEventListener(playerKineticImage) {
        playerCenterX = playerKineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2;
        playerCenterY = playerKineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2;
=======
    function addMouseEventListener(player) {
        var playerCenterX = player.getX() + CONSTANTS.PLAYER_WIDTH / 2,
            playerCenterY = player.getY() + CONSTANTS.PLAYER_HEIGHT / 2;
>>>>>>> 2e62ba9d5e4ca57eb7f1cea84684db787d2a1f78

        gameplayContainer.addEventListener('mousemove', function (e) {
            // Left
            if (e.clientX < playerCenterX) {
<<<<<<< HEAD
                if (Math.abs(e.clientY - playerCenterY) < playerCenterX - e.clientX) {
                    playerKineticImage.setCrop({
                        x: 0,
                        y: CONSTANTS.FACING_DIRECTION.LEFT * CONSTANTS.PLAYER_HEIGHT,
=======
                if (Math.abs(e.clientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - e.clientX)) {
                    player.setCrop({
                        x: CONSTANTS.FACING_DIRECTIONS.LEFT * CONSTANTS.PLAYER_WIDTH,
                        y: 0,
>>>>>>> 2e62ba9d5e4ca57eb7f1cea84684db787d2a1f78
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            // Right
            if (e.clientX > playerCenterX) {
<<<<<<< HEAD
                if (Math.abs(e.clientY - playerCenterY) < e.clientX - playerCenterX) {
                    playerKineticImage.setCrop({
                        x: 0,
                        y: CONSTANTS.FACING_DIRECTION.RIGHT * CONSTANTS.PLAYER_HEIGHT,
=======
                if (Math.abs(e.clientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (e.clientX - playerCenterX)) {
                    player.setCrop({
                        x: CONSTANTS.FACING_DIRECTIONS.RIGHT * CONSTANTS.PLAYER_WIDTH,
                        y: 0,
>>>>>>> 2e62ba9d5e4ca57eb7f1cea84684db787d2a1f78
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            // Up
            if (e.clientY < playerCenterY) {
<<<<<<< HEAD
                if (Math.abs(e.clientX - playerCenterX) < playerCenterY - e.clientY) {
                    playerKineticImage.setCrop({
                        x: 0,
                        y: CONSTANTS.FACING_DIRECTION.UP * CONSTANTS.PLAYER_HEIGHT,
=======
                if (Math.abs(e.clientX - playerCenterX) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterY - e.clientY)) {
                    player.setCrop({
                        x: CONSTANTS.FACING_DIRECTIONS.UP * CONSTANTS.PLAYER_WIDTH,
                        y: 0,
>>>>>>> 2e62ba9d5e4ca57eb7f1cea84684db787d2a1f78
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            // Down
            if (e.clientY > playerCenterY) {
<<<<<<< HEAD
                if (Math.abs(e.clientX - playerCenterX) < e.clientY - playerCenterY) {
                    playerKineticImage.setCrop({
                        x: 0,
                        y: CONSTANTS.FACING_DIRECTION.DOWN * CONSTANTS.PLAYER_HEIGHT,
=======
                if (Math.abs(e.clientX - playerCenterX) < Math.tan(22.5 / 180 * Math.PI) * (e.clientY - playerCenterY)) {
                    player.setCrop({
                        x: CONSTANTS.FACING_DIRECTIONS.DOWN * CONSTANTS.PLAYER_WIDTH,
                        y: 0,
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            // Up-Left
            if (e.clientX < playerCenterX) {
                if (playerCenterY - e.clientY > Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - e.clientX) &&
                        playerCenterY - e.clientY < Math.tan(67.5 / 180 * Math.PI) * (playerCenterX - e.clientX)) {
                    player.setCrop({
                        x: CONSTANTS.FACING_DIRECTIONS.UP_LEFT * CONSTANTS.PLAYER_WIDTH,
                        y: 0,
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            // Down-Left
            if (e.clientX < playerCenterX) {
                if (e.clientY - playerCenterY > Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - e.clientX) &&
                        e.clientY - playerCenterY < Math.tan(67.5 / 180 * Math.PI) * (playerCenterX - e.clientX)) {
                    player.setCrop({
                        x: CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT * CONSTANTS.PLAYER_WIDTH,
                        y: 0,
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            // Up-Right
            if (e.clientX > playerCenterX) {
                if (playerCenterY - e.clientY > Math.tan(22.5 / 180 * Math.PI) * (e.clientX - playerCenterX) &&
                    playerCenterY - e.clientY < Math.tan(67.5 / 180 * Math.PI) * (e.clientX - playerCenterX)) {
                    player.setCrop({
                        x: CONSTANTS.FACING_DIRECTIONS.UP_RIGHT * CONSTANTS.PLAYER_WIDTH,
                        y: 0,
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT
                    });
                }
            }

            // Down-Right
            if (e.clientX > playerCenterX) {
                if (e.clientY - playerCenterY > Math.tan(22.5 / 180 * Math.PI) * (e.clientX - playerCenterX) &&
                    e.clientY - playerCenterY < Math.tan(67.5 / 180 * Math.PI) * (e.clientX - playerCenterX)) {
                    player.setCrop({
                        x: CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT * CONSTANTS.PLAYER_WIDTH,
                        y: 0,
>>>>>>> 2e62ba9d5e4ca57eb7f1cea84684db787d2a1f78
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

            (function spawnEnemy() {
                setTimeout(function () {
                    requestAnimationFrame(spawnEnemy);

                    currentFrame += 1;

                    if (enemyFrame < CONSTANTS.ENEMY_FRAME_COUNT - 1) {
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