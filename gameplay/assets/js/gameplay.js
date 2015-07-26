window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 1000,
<<<<<<< HEAD
        STAGE_HEIGHT: 800,

        SCALE_HEIGHT: (1/21),
        SCALE_WIDTH: (1/4.5),
=======
        STAGE_HEIGHT: 600,
>>>>>>> e6d07cc650e52ad9db2a1936821969b67a4edd24

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

        KEYS: {
            A: 65,
            E: 69,
            Q: 81,
            W: 87
        },

        ENEMY_WIDTH: 99.2,
        ENEMY_HEIGHT: 111,
        ENEMY_FRAME_COUNT: 10
    };

    var gameplayContainer,
        stage,
        backgroundLayer,
        playerLayer,
        enemiesLayer,
        backgroundImageObj,
        player,
        playerImageObj,
        playerCenterX,
        playerCenterY,
        enemyImageObj,
        keyPressed,
        currentFrame = 0,
        enemyFrame = 0;


    function loadCanvas() {
        gameplayContainer = document.getElementById('gameplay-container');
        gameplayContainer.setAttribute('width', CONSTANTS.STAGE_WIDTH);
        gameplayContainer.setAttribute('height', CONSTANTS.STAGE_HEIGHT);

        //Position the action screen
        //gameplayContainer.style.position = 'absolute';
        //gameplayContainer.style.top = (screen.height * CONSTANTS.SCALE_HEIGHT) + 'px';
        //gameplayContainer.style.left = (screen.width * CONSTANTS.SCALE_WIDTH) + 'px';

        stage = new Kinetic.Stage({
            container: 'gameplay-container',
            width: CONSTANTS.STAGE_WIDTH,
            height: CONSTANTS.STAGE_HEIGHT
        });

        backgroundLayer = new Kinetic.Layer();
        enemiesLayer = new Kinetic.Layer();
        playerLayer = new Kinetic.Layer();
    }

    function loadPlayer() {
        playerImageObj = new Image();

        playerImageObj.onload = function () {
            var playerKineticImage = new Kinetic.Image({
                x: 0,
                y: 0,
                image: playerImageObj,
                width: CONSTANTS.PLAYER_WIDTH,
                height: CONSTANTS.PLAYER_HEIGHT,
                crop: {
                    x: CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT * CONSTANTS.PLAYER_WIDTH,
                    y: 0,
                    width: CONSTANTS.PLAYER_WIDTH,
                    height: CONSTANTS.PLAYER_HEIGHT
                }
            });

            player = {
                x: 5,
                y: 5,
                kineticImage: playerKineticImage,
                facingDirection: CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT
            };

            addMouseEventListener(player.kineticImage);
            playerLayer.add(player.kineticImage);
            stage.add(playerLayer);
        };

        playerImageObj.src = "assets/images/shooter-sprite.png";
    }

    function loadBackground() {
        backgroundImageObj = new Image();

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

        backgroundImageObj.src = "assets/images/canvas-bckg.jpg";
    }

    function addKeystrokeListener() {
        gameplayContainer.addEventListener('keyup', function(e) {
            keyPressed = e.keyCode;

            if(keyPressed === CONSTANTS.KEYS.Q) {

            }
            else if(keyPressed === CONSTANTS.KEYS.W) {

            }
            else if(keyPressed === CONSTANTS.KEYS.E) {

            }
            else if(keyPressed === CONSTANTS.KEYS.A) {

            }
        });
    }

    function checkDirectionAndReact() {
        switch(player.facingDirection) {
            case CONSTANTS.FACING_DIRECTIONS.UP: {

                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN: {

                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.LEFT: {

                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.RIGHT: {

                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.UP_LEFT: {

                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.UP_RIGHT: {

                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT: {

                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT: {

                break;
            }
        }
    }

    function addMouseEventListener() {
        gameplayContainer.addEventListener('mousemove', function (e) {

            playerCenterX = player.x + CONSTANTS.PLAYER_WIDTH / 2;
            playerCenterY = player.y + CONSTANTS.PLAYER_HEIGHT / 2;

            // Left
            if (e.clientX < playerCenterX) {
                if (Math.abs(e.clientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - e.clientX)) {
                    if(player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.LEFT) {
                        player.kineticImage.setCrop({
                            x: CONSTANTS.FACING_DIRECTIONS.LEFT * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        });
                        player.facingDirection = CONSTANTS.FACING_DIRECTIONS.LEFT;
                    }
                }
            }

            // Right
            if (e.clientX > playerCenterX) {
                if (Math.abs(e.clientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (e.clientX - playerCenterX)) {
                    if(player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.RIGHT) {
                        player.kineticImage.setCrop({
                            x: CONSTANTS.FACING_DIRECTIONS.RIGHT * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        });
                        player.facingDirection = CONSTANTS.FACING_DIRECTIONS.RIGHT;
                    }
                }
            }

            // Down
            if (e.clientY < playerCenterY) {
                if (Math.abs(e.clientX - playerCenterX) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterY - e.clientY)) {
                    if(player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.DOWN) {
                        player.kineticImage.setCrop({
                            x: CONSTANTS.FACING_DIRECTIONS.DOWN * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        });
                        player.facingDirection = CONSTANTS.FACING_DIRECTIONS.DOWN;
                    }
                }
            }

            // Up
            if (e.clientY > playerCenterY) {
                if (Math.abs(e.clientX - playerCenterX) < Math.tan(22.5 / 180 * Math.PI) * (e.clientY - playerCenterY)) {
                    if(player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.UP) {
                        player.kineticImage.setCrop({
                            x: CONSTANTS.FACING_DIRECTIONS.UP * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        });
                        player.facingDirection = CONSTANTS.FACING_DIRECTIONS.UP;
                    }
                }
            }

            // Up-Left
            if (e.clientX < playerCenterX) {
                if (playerCenterY - e.clientY > Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - e.clientX) &&
                    playerCenterY - e.clientY < Math.tan(67.5 / 180 * Math.PI) * (playerCenterX - e.clientX)) {
                    if(player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.UP_LEFT) {
                        player.kineticImage.setCrop({
                            x: CONSTANTS.FACING_DIRECTIONS.UP_LEFT * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        });
                        player.facingDirection = CONSTANTS.FACING_DIRECTIONS.UP_LEFT;
                    }
                }
            }

            // Down-Left
            if (e.clientX < playerCenterX) {
                if (e.clientY - playerCenterY > Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - e.clientX) &&
                    e.clientY - playerCenterY < Math.tan(67.5 / 180 * Math.PI) * (playerCenterX - e.clientX)) {
                    if(player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT) {
                        player.kineticImage.setCrop({
                            x: CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        });
                        player.facingDirection = CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT;
                    }
                }
            }

            // Up-Right
            if (e.clientX > playerCenterX) {
                if (playerCenterY - e.clientY > Math.tan(22.5 / 180 * Math.PI) * (e.clientX - playerCenterX) &&
                    playerCenterY - e.clientY < Math.tan(67.5 / 180 * Math.PI) * (e.clientX - playerCenterX)) {
                    if(player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.UP_RIGHT) {
                        player.kineticImage.setCrop({
                            x: CONSTANTS.FACING_DIRECTIONS.UP_RIGHT * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        });
                        player.facingDirection = CONSTANTS.FACING_DIRECTIONS.UP_RIGHT;
                    }
                }
            }

            // Down-Right
            if (e.clientX > playerCenterX) {
                if (e.clientY - playerCenterY > Math.tan(22.5 / 180 * Math.PI) * (e.clientX - playerCenterX) &&
                    e.clientY - playerCenterY < Math.tan(67.5 / 180 * Math.PI) * (e.clientX - playerCenterX)) {
                    if(player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT) {
                        player.kineticImage.setCrop({
                            x: CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        });
                        player.facingDirection = CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT;
                    }
                }
            }

            playerLayer.draw();
        });
    }

    function loadEnemy() {
        enemyImageObj = new Image();

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

            enemiesLayer.add(enemy);
            stage.add(enemiesLayer);

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

                    enemiesLayer.draw();
                }, 100)
            }());
        };

        enemyImageObj.src = "assets/images/enemy.png";
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


// Returns a random INTEGER number from the range between MIN and MAX values.
function getRandomCoordinate(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
