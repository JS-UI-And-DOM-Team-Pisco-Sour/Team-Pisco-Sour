window.onload = function () {
    var CONSTANTS = {
        STAGE_WIDTH: 1000,
        STAGE_HEIGHT: 600,

        SCALE_HEIGHT: (1 / 21),
        SCALE_WIDTH: (1 / 4.5),

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
        ENEMY_FRAME_COUNT: 10,
        ENEMY_SPAWN_FRAME_INTERVAL: 20
    };

    var gameplayContainer,
        wholeDoc,

        stage,
        backgroundLayer,
        playerLayer,
        enemiesLayer,

        backgroundImageObj,
        playerImageObj,
        enemyImageObj,

        player,
        playerCenterX,
        playerCenterY,

        enemies = [],

        keyPressed,

        currentFrame = 0,
        enemyFrame = 0;


    function loadCanvas() {
        gameplayContainer = document.getElementById('gameplay-container');
        gameplayContainer.setAttribute('width', CONSTANTS.STAGE_WIDTH);
        gameplayContainer.setAttribute('height', CONSTANTS.STAGE_HEIGHT);
        wholeDoc = document.getElementById('body');

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
                x: 50,
                y: 50,
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
                kineticImage: playerKineticImage,
                facingDirection: CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT
            };

            addKeystrokeListener();
            addMouseEventListener();
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
        wholeDoc.addEventListener('keyup', function (e) {
            keyPressed = e.keyCode ? e.keyCode : e.which;

            if (keyPressed === CONSTANTS.KEYS.Q) {
                checkDirectionAndTeleport(100);
            }
            else if (keyPressed === CONSTANTS.KEYS.W) {
                checkDirectionAndTeleport(200);
            }
            else if (keyPressed === CONSTANTS.KEYS.E) {
                checkDirectionAndTeleport(300);
            }
            else if (keyPressed === CONSTANTS.KEYS.A) {
                // TODO: Raise Hell
            }
        });
    }

    function checkDirectionAndTeleport(stepsLength) {
        switch (player.facingDirection) {
            //TODO: Check If Out of Border for each case.
            case CONSTANTS.FACING_DIRECTIONS.UP:
            {
                player.kineticImage.setY(player.kineticImage.getY() + stepsLength);
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN:
            {
                player.kineticImage.setY(player.kineticImage.getY() - stepsLength);
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.LEFT:
            {
                player.kineticImage.setX(player.kineticImage.getX() - stepsLength);
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.RIGHT:
            {
                player.kineticImage.setX(player.kineticImage.getX() + stepsLength);
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.UP_LEFT:
            {
                player.kineticImage.setX(player.kineticImage.getX() - stepsLength);
                player.kineticImage.setY(player.kineticImage.getY() - stepsLength);
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.UP_RIGHT:
            {
                player.kineticImage.setX(player.kineticImage.getX() + stepsLength);
                player.kineticImage.setY(player.kineticImage.getY() - stepsLength);
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT:
            {
                player.kineticImage.setX(player.kineticImage.getX() - stepsLength);
                player.kineticImage.setY(player.kineticImage.getY() + stepsLength);
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT:
            {
                player.kineticImage.setX(player.kineticImage.getX() + stepsLength);
                player.kineticImage.setY(player.kineticImage.getY() + stepsLength);
                break;
            }
        }

        playerLayer.draw();
    }

    function addMouseEventListener() {
        gameplayContainer.addEventListener('mousemove', function (e) {

            playerCenterX = player.kineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2;
            playerCenterY = player.kineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2;

            // Left
            if (e.clientX < playerCenterX) {
                if (Math.abs(e.clientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - e.clientX)) {
                    if (player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.LEFT) {
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
                    if (player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.RIGHT) {
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
                    if (player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.DOWN) {
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
                    if (player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.UP) {
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
                    if (player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.UP_LEFT) {
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
                    if (player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT) {
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
                    if (player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.UP_RIGHT) {
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
                    if (player.facingDirection !== CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT) {
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

    function loadInitialEnemy() {
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
                },

                scale: {
                    x: 0.6,
                    y: 0.6
                }
            });

            enemies.push({
                enemy: enemy,
                frame: currentFrame
            });

            enemiesLayer.add(enemy);
            stage.add(enemiesLayer);
        };

        enemyImageObj.src = "assets/images/enemy.png";
    }

    // Returns a random INTEGER number from the range between MIN and MAX values.
    function getRandomCoordinate(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function initialize() {
        loadCanvas();

        loadBackground();
        loadPlayer();
        loadInitialEnemy();
    }

    function run() {
        setTimeout(function () {
            requestAnimationFrame(run);

            currentFrame += 1;

            // Spawning a new Enemy
            if (currentFrame % CONSTANTS.ENEMY_SPAWN_FRAME_INTERVAL === 0) {
                var newEnemy = new Kinetic.Image({
                    x: getRandomCoordinate(100, 800),
                    y: getRandomCoordinate(100, 800),
                    image: enemyImageObj,
                    width: CONSTANTS.ENEMY_WIDTH,
                    height: CONSTANTS.ENEMY_HEIGHT,
                    crop: {
                        x: 0,
                        y: 0,
                        width: CONSTANTS.ENEMY_WIDTH,
                        height: CONSTANTS.ENEMY_HEIGHT
                    },

                    scale: {
                        x: 0.6,
                        y: 0.6
                    }
                });

                enemies.push({
                    enemy: newEnemy,
                    frame: currentFrame
                });

                enemiesLayer.add(newEnemy);
            }

            // Updating each Enemy separately
            for (var i = 0, len = enemies.length; i < len; i += 1) {
                var currentEnemyFrame = currentFrame - enemies[i].frame;
                if (currentEnemyFrame < CONSTANTS.ENEMY_FRAME_COUNT - 1) {
                    enemies[i].enemy.setCrop({
                        x: currentEnemyFrame * CONSTANTS.ENEMY_WIDTH,
                        y: 0,
                        width: CONSTANTS.ENEMY_WIDTH,
                        height: CONSTANTS.ENEMY_HEIGHT
                    });
                }
            }

            backgroundLayer.setZIndex(1);
            playerLayer.setZIndex(3);
            enemiesLayer.setZIndex(2);

            enemiesLayer.draw();
        }, 100)
    }

    (function () {
        initialize();
        run();
    }());
};
