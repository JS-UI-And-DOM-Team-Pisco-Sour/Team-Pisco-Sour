window.onload = function () {
    // Immediately load all sounds
    (function () {
        createjs.Sound.registerSound('assets/sounds/boom.mp3', 'bomb');
        createjs.Sound.registerSound('assets/sounds/gunfire.mp3', 'gun');
    }());

    var CONSTANTS = {
        STAGE_WIDTH: 1000,
        STAGE_HEIGHT: 600,

        SCALE_HEIGHT: (1 / 21),
        SCALE_WIDTH: (1 / 4.5),

        PLAYER_WIDTH: 155,
        PLAYER_HEIGHT: 160,
        PLAYER_DEATH_ANIMATION_FRAMES_COUNT: 48,

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
        ENEMY_SPAWN_FRAME_INTERVAL: 20,

        EXPLOSION_WIDTH: 256,
        EXPLOSION_HEIGHT: 256,
        EXPLOSION_SCALE: 2.6
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
        playerKineticImage,

        enemies = [],

        keyPressed,

        firstLineEquation,
        secondLineEquation,
        teleportationStartPoint,
        teleportationEndPoint,
        boundaryStartPoint,
        boundaryEndPoint,
        intersectionPoint,

        currentFrame = 0,
        enemyFrame = 0,

        deathModeOn = true;


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
            playerKineticImage = new Kinetic.Image({
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
            addMouseEventListeners();
            playerLayer.add(player.kineticImage);
            stage.add(playerLayer);
        };

        playerImageObj.src = "assets/images/player.png";
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

        backgroundImageObj.src = "assets/images/canvas-bg.jpg";
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

    function checkDirectionAndTeleport(stepsLength) {
        switch (player.facingDirection) {
            //TODO: Check If Out of Border for each case.
            case CONSTANTS.FACING_DIRECTIONS.UP:
            {
                if(playerOutOfBorders(player.kineticImage.getX(), player.kineticImage.getY() + stepsLength)) {

                }
                else {
                    player.kineticImage.setY(player.kineticImage.getY() + stepsLength);
                }
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN:
            {
                if(playerOutOfBorders(player.kineticImage.getX(), player.kineticImage.getY() + stepsLength)) {

                }
                else {
                    player.kineticImage.setY(player.kineticImage.getY() - stepsLength);
                }
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.LEFT:
            {
                if(playerOutOfBorders(player.kineticImage.getX(), player.kineticImage.getY() + stepsLength)) {

                }
                else {
                    player.kineticImage.setX(player.kineticImage.getX() - stepsLength);
                }
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.RIGHT:
            {
                if(playerOutOfBorders(player.kineticImage.getX(), player.kineticImage.getY() + stepsLength)) {

                }
                else {
                    player.kineticImage.setX(player.kineticImage.getX() + stepsLength);
                }
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.UP_LEFT:
            {
                if(playerOutOfBorders(player.kineticImage.getX(), player.kineticImage.getY() + stepsLength)) {

                }
                else {
                    player.kineticImage.setX(player.kineticImage.getX() - getDisplacement(stepsLength));
                    player.kineticImage.setY(player.kineticImage.getY() - getDisplacement(stepsLength));
                }
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.UP_RIGHT:
            {
                if(playerOutOfBorders(player.kineticImage.getX(), player.kineticImage.getY() + stepsLength)) {

                }
                else {
                    player.kineticImage.setX(player.kineticImage.getX() + getDisplacement(stepsLength));
                    player.kineticImage.setY(player.kineticImage.getY() - getDisplacement(stepsLength));
                }
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT:
            {
                if(playerOutOfBorders(
                        player.kineticImage.getX(),
                        player.kineticImage.getY() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_HEIGHT)) {

                }
                else {
                    player.kineticImage.setX(player.kineticImage.getX() - getDisplacement(stepsLength));
                    player.kineticImage.setY(player.kineticImage.getY() + getDisplacement(stepsLength));
                }
                break;
            }
            case CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT:
            {
                if (playerOutOfBorders(
                        player.kineticImage.getX() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_WIDTH,
                        player.kineticImage.getY() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_HEIGHT
                    ))
                {
                    teleportationStartPoint = {
                        x: player.kineticImage.getX(),
                        y: player.kineticImage.getY()
                    };
                    teleportationEndPoint = {
                        x: player.kineticImage.getX() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_WIDTH,
                        y: player.kineticImage.getY() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_HEIGHT
                    };
                    boundaryStartPoint = {
                        x: 0,
                        y: CONSTANTS.STAGE_HEIGHT
                    };
                    boundaryEndPoint = {
                        x: CONSTANTS.STAGE_WIDTH,
                        y: CONSTANTS.STAGE_HEIGHT
                    };

                    firstLineEquation = getStraightLineEquation(teleportationStartPoint,teleportationEndPoint);
                    secondLineEquation = getStraightLineEquation(boundaryStartPoint, boundaryEndPoint);
                    intersectionPoint = intersectionPointBetweenTwoStraightLines(firstLineEquation, secondLineEquation);

                    player.kineticImage.setX(Math.abs(intersectionPoint.x) - CONSTANTS.PLAYER_WIDTH);
                    player.kineticImage.setY(Math.abs(intersectionPoint.y) - CONSTANTS.PLAYER_HEIGHT);
                }
                else if (playerOutOfBorders(
                        player.kineticImage.getX() + getDisplacement(stepsLength),
                        player.kineticImage.getY() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_HEIGHT)) {
                    teleportationStartPoint = {
                        x: player.kineticImage.getX(),
                        y: player.kineticImage.getY()
                    };
                    teleportationEndPoint = {
                        x: player.kineticImage.getX() + getDisplacement(stepsLength),
                        y: player.kineticImage.getY() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_HEIGHT
                    };
                    boundaryStartPoint = {
                        x: CONSTANTS.STAGE_WIDTH,
                        y: CONSTANTS.STAGE_HEIGHT
                    };
                    boundaryEndPoint = {
                        x: CONSTANTS.STAGE_WIDTH,
                        y: 0
                    };

                    firstLineEquation = getStraightLineEquation(teleportationStartPoint,teleportationEndPoint);
                    secondLineEquation = getStraightLineEquation(boundaryStartPoint, boundaryEndPoint);
                    intersectionPoint = intersectionPointBetweenTwoStraightLines(firstLineEquation, secondLineEquation);

                    player.kineticImage.setX(Math.abs(intersectionPoint.x) + CONSTANTS.PLAYER_WIDTH / 2);
                    player.kineticImage.setY(Math.abs(intersectionPoint.y) - CONSTANTS.PLAYER_HEIGHT);
                }
                else if(playerOutOfBorders(
                        player.kineticImage.getX() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_WIDTH,
                        player.kineticImage.getY() + getDisplacement(stepsLength)
                    )) {
                    teleportationStartPoint = {
                        x: player.kineticImage.getX(),
                        y: player.kineticImage.getY()
                    };
                    teleportationEndPoint = {
                        x: player.kineticImage.getX() + getDisplacement(stepsLength) + CONSTANTS.PLAYER_WIDTH,
                        y: player.kineticImage.getY() + getDisplacement(stepsLength)
                    };
                    boundaryStartPoint = {
                        x: CONSTANTS.STAGE_WIDTH,
                        y: CONSTANTS.STAGE_HEIGHT
                    };
                    boundaryEndPoint = {
                        x: CONSTANTS.STAGE_WIDTH,
                        y: 0
                    };

                    firstLineEquation = getStraightLineEquation(teleportationStartPoint, teleportationEndPoint);
                    secondLineEquation = getStraightLineEquation(boundaryStartPoint, boundaryEndPoint);
                    intersectionPoint = intersectionPointBetweenTwoStraightLines(firstLineEquation, secondLineEquation);

                    player.kineticImage.setX(Math.abs(intersectionPoint.x) - CONSTANTS.PLAYER_WIDTH);
                    player.kineticImage.setY(Math.abs(intersectionPoint.y) + CONSTANTS.PLAYER_HEIGHT / 2);
                }
                else {
                    player.kineticImage.setX(player.kineticImage.getX() + getDisplacement(stepsLength));
                    player.kineticImage.setY(player.kineticImage.getY() + getDisplacement(stepsLength));
                }
                break;
            }
        }

        playerLayer.draw();
    }
    
    function addMouseEventListeners() {
        stage.addEventListener('mousemove', function (e) {

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
        stage.addEventListener('click', function (e) {
            e = e || window.event; // for IE
            var isRightClick;
            if('which' in e) {
                isRightClick = e.which === 3;
            } else if('button' in e) { // for IE
                isRightClick = e.button === 2;
            }

            if(!isRightClick) {
                createjs.Sound.play('gun');
            }
        })
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

    function runDeathAnimation(targetX, targetY, scale) {
        var deathObj = new Image();
        deathObj.onload = function () {
            var deathAnim = new Kinetic.Sprite({
                x: targetX + CONSTANTS.PLAYER_WIDTH / 2 - CONSTANTS.EXPLOSION_WIDTH / 2 * CONSTANTS.EXPLOSION_SCALE,
                y: targetY + CONSTANTS.PLAYER_HEIGHT / 2 - CONSTANTS.EXPLOSION_HEIGHT / 2 * CONSTANTS.EXPLOSION_SCALE,
                image: deathObj,
                scale: {
                    x: scale,
                    y: scale
                },

                animation: 'death',
                animations: {
                    death: [
                        0, 0, 256, 256,
                        256, 0, 256, 256,
                        512, 0, 256, 256,
                        768, 0, 256, 256,
                        1024, 0, 256, 256,
                        1280, 0, 256, 256,
                        1536, 0, 256, 256,
                        1792, 0, 256, 256,

                        0, 256, 256, 256,
                        256, 256, 256, 256,
                        512, 256, 256, 256,
                        768, 256, 256, 256,
                        1024, 256, 256, 256,
                        1280, 256, 256, 256,
                        1536, 256, 256, 256,
                        1792, 256, 256, 256,

                        0, 512, 256, 256,
                        256, 512, 256, 256,
                        512, 512, 256, 256,
                        768, 512, 256, 256,
                        1024, 512, 256, 256,
                        1280, 512, 256, 256,
                        1536, 512, 256, 256,
                        1792, 512, 256, 256,

                        0, 768, 256, 256,
                        256, 768, 256, 256,
                        512, 768, 256, 256,
                        768, 768, 256, 256,
                        1024, 768, 256, 256,
                        1280, 768, 256, 256,
                        1536, 768, 256, 256,
                        1792, 768, 256, 256,

                        0, 1024, 256, 256,
                        256, 1024, 256, 256,
                        512, 1024, 256, 256,
                        768, 1024, 256, 256,
                        1024, 1024, 256, 256,
                        1280, 1024, 256, 256,
                        1536, 1024, 256, 256,
                        1792, 1024, 256, 256,

                        0, 1280, 256, 256,
                        256, 1280, 256, 256,
                        512, 1280, 256, 256,
                        768, 1280, 256, 256,
                        1024, 1280, 256, 256,
                        1280, 1280, 256, 256,
                        1536, 1280, 256, 256,
                        1792, 1280, 256, 256
                    ]
                },

                frameRate: 30,
                frameIndex: 0
            });

            var frameCount = 0;

            playerLayer.add(deathAnim);
            deathAnim.on('frameIndexChange', function (e) {
                if(frameCount === 0) {
                    createjs.Sound.play('bomb');
                }

                if(++frameCount > CONSTANTS.PLAYER_DEATH_ANIMATION_FRAMES_COUNT - 1) {
                    deathAnim.stop();
                    deathAnim.hide();
                    frameCount = 0;
                }
            });

            deathAnim.start();
        };

        deathObj.src = 'assets/images/explosion.png';
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
                console.log(playerKineticImage);
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
        }, 100);

        // some code sets deathModeOn to true
        if(deathModeOn) {
            runDeathAnimation(50, 50, 2.5);
            deathModeOn = false;
        }
    }

    (function () {
        initialize();
        run();
    }());
};