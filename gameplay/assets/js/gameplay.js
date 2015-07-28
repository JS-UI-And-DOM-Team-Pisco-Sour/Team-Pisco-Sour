window.onload = function() {
    window.Object.defineProperty(Element.prototype, 'documentOffsetTop', {
        get: function() {
            return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop : 0);
        }
    });

    window.Object.defineProperty(Element.prototype, 'documentOffsetLeft', {
        get: function() {
            return this.offsetLeft + (this.offsetParent ? this.offsetParent.documentOffsetLeft : 0);
        }
    });

    // Immediately load all sounds
    (function() {
        createjs.Sound.registerSound('assets/sounds/boom.mp3', 'bomb');
        createjs.Sound.registerSound('assets/sounds/gunfire.mp3', 'gun');
    }());

    var CONSTANTS = {
        STAGE_WIDTH: 0.7 * window.innerWidth,
        STAGE_HEIGHT: 0.9 * window.innerHeight,

        SCALE_HEIGHT: (1 / 6),
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
        ENEMY_SPEED: 2,

        EXPLOSION_WIDTH: 256,
        EXPLOSION_HEIGHT: 256,
        EXPLOSION_SCALE: 2.6,
        EXPLOSION_FRAME_RATE: 30,

        BULLET_SHOT_SCALE: 0.2,
        BULLET_SHOT_FRAMERATE: 10000000,
        SHIFT: 30
    };

    var gameplayContainer,
        gameNameContainer,
        wholeDocContainer,

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
        bulletShotAnimationCoords,

        //playerAutoPosition,
        //playerLineEquation,

        currentFrame = 0,
        enemyFrame = 0,

        deathModeOn = false;


    function loadCanvas() {
        gameplayContainer = document.getElementById('gameplay-container');
        gameNameContainer = document.getElementById('game-name');
        wholeDocContainer = document.getElementById('body');

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
        playerImageObj.onload = function() {
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

        backgroundImageObj.onload = function() {
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
        wholeDocContainer.addEventListener('keyup', function(e) {
            keyPressed = e.keyCode ? e.keyCode : e.which;

            if (keyPressed === CONSTANTS.KEYS.Q) {
                checkDirectionAndTeleport(100);
            } else if (keyPressed === CONSTANTS.KEYS.W) {
                checkDirectionAndTeleport(200);
            } else if (keyPressed === CONSTANTS.KEYS.E) {
                checkDirectionAndTeleport(300);
            } else if (keyPressed === CONSTANTS.KEYS.A) {
                // TODO: Raise Hell
            }
        });
    }

    function checkDirectionAndTeleport(stepsLength) {
        switch (player.facingDirection) {
            //TODO: Check If Out of Border for each case.
            case CONSTANTS.FACING_DIRECTIONS.UP:
                {
                    if (playerOutOfBorders(player.kineticImage.getX(), player.kineticImage.getY() + stepsLength)) {

                    } else {
                        player.kineticImage.setY(player.kineticImage.getY() + stepsLength);
                    }
                    break;
                }
            case CONSTANTS.FACING_DIRECTIONS.DOWN:
                {
                    if (playerOutOfBorders(player.kineticImage.getX(), player.kineticImage.getY() - stepsLength)) {

                    } else {
                        player.kineticImage.setY(player.kineticImage.getY() - stepsLength);
                    }
                    break;
                }
            case CONSTANTS.FACING_DIRECTIONS.LEFT:
                {
                    if (playerOutOfBorders(player.kineticImage.getX() - stepsLength, player.kineticImage.getY())) {

                    } else {
                        player.kineticImage.setX(player.kineticImage.getX() - stepsLength);
                    }
                    break;
                }
            case CONSTANTS.FACING_DIRECTIONS.RIGHT:
                {
                    if (playerOutOfBorders(player.kineticImage.getX() + stepsLength, player.kineticImage.getY())) {

                    } else {
                        player.kineticImage.setX(player.kineticImage.getX() + stepsLength);
                    }
                    break;
                }
            case CONSTANTS.FACING_DIRECTIONS.UP_LEFT:
                {
                    if (playerOutOfBorders(
                            player.kineticImage.getX() - getDisplacement(stepsLength),
                            player.kineticImage.getY() - getDisplacement(stepsLength))) {

                    } else {
                        player.kineticImage.setX(player.kineticImage.getX() - getDisplacement(stepsLength));
                        player.kineticImage.setY(player.kineticImage.getY() - getDisplacement(stepsLength));
                    }
                    break;
                }
            case CONSTANTS.FACING_DIRECTIONS.UP_RIGHT:
                {
                    if (playerOutOfBorders(
                            player.kineticImage.getX() + getDisplacement(stepsLength),
                            player.kineticImage.getY() - getDisplacement(stepsLength))) {

                    } else {
                        player.kineticImage.setX(player.kineticImage.getX() + getDisplacement(stepsLength));
                        player.kineticImage.setY(player.kineticImage.getY() - getDisplacement(stepsLength));
                    }
                    break;
                }
            case CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT:
                {
                    if (playerOutOfBorders(
                            player.kineticImage.getX() - getDisplacement(stepsLength),
                            player.kineticImage.getY() + getDisplacement(stepsLength))) {

                    } else {
                        player.kineticImage.setX(player.kineticImage.getX() - getDisplacement(stepsLength));
                        player.kineticImage.setY(player.kineticImage.getY() + getDisplacement(stepsLength));
                    }
                    break;
                }
            case CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT:
                {
                    if (playerOutOfBorders(
                            player.kineticImage.getX() + getDisplacement(stepsLength),
                            player.kineticImage.getY() + getDisplacement(stepsLength))) {

                    } else {
                        player.kineticImage.setX(player.kineticImage.getX() + getDisplacement(stepsLength));
                        player.kineticImage.setY(player.kineticImage.getY() + getDisplacement(stepsLength));
                    }
                    break;
                }
        }

        playerLayer.draw();
    }

    //function checkWhereTheBorderIsCrossed() {
    //    playerLineEquation = getStraightLineEquation({
    //            x: player.kineticImage.getX(),
    //            y: player.kineticImage.getY()
    //        },
    //        {
    //            x: x,
    //            y: y
    //        });
    //
    //    if(x <= 0 && y <= 0) {
    //        playerAutoPosition = {
    //
    //        }
    //    }
    //    else if(x <= 0 && y >= CONSTANTS.STAGE_HEIGHT) {
    //        playerAutoPosition = {
    //
    //        }
    //    }
    //    else if(x >= CONSTANTS.STAGE_WIDTH && y <= 0) {
    //        playerAutoPosition = {
    //
    //        }
    //    }
    //    else if(x >= CONSTANTS.STAGE_WIDTH && y >= CONSTANTS.STAGE_HEIGHT) {
    //        playerAutoPosition = {
    //
    //        }
    //    }
    //    else if(x <= 0) {
    //        playerAutoPosition = {
    //
    //        }
    //    }
    //    else if(x >= (CONSTANTS.STAGE_WIDTH - CONSTANTS.PLAYER_WIDTH)) {
    //        playerAutoPosition = {
    //
    //        }
    //    }
    //    else if(y <= 0) {
    //        playerAutoPosition = {
    //            x: (-(playerLineEquation.C/playerLineEquation.A)),
    //            y: CONSTANTS.PLAYER_HEIGHT/4
    //        };
    //
    //        player.kineticImage.setX(playerAutoPosition.x);
    //        player.kineticImage.setY(playerAutoPosition.y);
    //        alert(player.kineticImage.getX() + ' ' + player.kineticImage.getY());
    //    }
    //    else if(y >= (CONSTANTS.STAGE_HEIGHT - CONSTANTS.PLAYER_HEIGHT)) {
    //        playerAutoPosition = {
    //
    //        }
    //    }
    //}
    //function getIntersectionPointBetweenTwoLines(firstLine, secondLine) {
    //    var delta = (firstLine.A*secondLine.B - secondLine.A*firstLine.B);
    //
    //    return {
    //        x: (secondLine.B * firstLine.C - firstLine.B * secondLine.C) / delta,
    //        y: (firstLine.A * secondLine.C - secondLine.A * firstLine.C) / delta
    //    };
    //}
    //

    function playerOutOfBorders(x, y) {
        return (
            x <= (0 - CONSTANTS.PLAYER_WIDTH / 8) ||
            y <= (0 - CONSTANTS.PLAYER_HEIGHT / 8) ||
            x >= (CONSTANTS.STAGE_WIDTH - CONSTANTS.PLAYER_WIDTH / 2 - 30) ||
            y >= (CONSTANTS.STAGE_HEIGHT - CONSTANTS.PLAYER_HEIGHT / 2 - 30));
    }

    function getDisplacement(stepsLength) {
        return stepsLength / Math.sqrt(2);
    }


    function getStraightLineEquation(pointA, pointB) {
        return {
            A: (pointB.y - pointA.y),
            B: (pointB.x - pointA.x),
            C: ((-pointA.x) * (pointB.y - pointA.y)) - ((-pointA.y) * (pointB.x - pointA.x))
        };
    }

    function addMouseEventListeners() {
        stage.addEventListener('mousemove', function(e) {
            $gameplayContainer = $('#gameplay-container');
            var relativeClientX = e.clientX - $gameplayContainer.offset().left;
            var relativeClientY = e.clientY - $gameplayContainer.offset().top;

            console.log(relativeClientX);

            playerCenterX = player.kineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2;
            playerCenterY = player.kineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2;

            // Left
            if (relativeClientX < playerCenterX) {
                if (Math.abs(relativeClientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - relativeClientX)) {
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
            if (relativeClientX > playerCenterX) {
                if (Math.abs(relativeClientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (relativeClientX - playerCenterX)) {
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
            if (relativeClientY < playerCenterY) {
                if (Math.abs(relativeClientX - playerCenterX) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterY - relativeClientY)) {
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
            if (relativeClientY > playerCenterY) {
                if (Math.abs(relativeClientX - playerCenterX) < Math.tan(22.5 / 180 * Math.PI) * (relativeClientY - playerCenterY)) {
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
            if (relativeClientX < playerCenterX) {

                if (playerCenterY - relativeClientY > Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - relativeClientX) &&
                    playerCenterY - relativeClientY < Math.tan(67.5 / 180 * Math.PI) * (playerCenterX - relativeClientX)) {
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
            if (relativeClientX < playerCenterX) {
                if (relativeClientY - playerCenterY > Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - relativeClientX) &&
                    relativeClientY - playerCenterY < Math.tan(67.5 / 180 * Math.PI) * (playerCenterX - relativeClientX)) {
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
            if (relativeClientX > playerCenterX) {
                if (playerCenterY - relativeClientY > Math.tan(22.5 / 180 * Math.PI) * (relativeClientX - playerCenterX) &&
                    playerCenterY - relativeClientY < Math.tan(67.5 / 180 * Math.PI) * (relativeClientX - playerCenterX)) {
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
            if (relativeClientX > playerCenterX) {
                if (relativeClientY - playerCenterY > Math.tan(22.5 / 180 * Math.PI) * (relativeClientX - playerCenterX) &&
                    relativeClientY - playerCenterY < Math.tan(67.5 / 180 * Math.PI) * (relativeClientX - playerCenterX)) {
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
        stage.addEventListener('mousedown', function(e) {
            e = e || window.event; // for IE
            var isRightClick;
            if ('which' in e) {
                isRightClick = e.which === 3;
            } else if ('button' in e) { // for IE
                isRightClick = e.button === 2;
            }

            if (!isRightClick) {
                bulletShotAnimationCoords = {};
                switch (player.facingDirection) {
                    case CONSTANTS.FACING_DIRECTIONS.LEFT:
                        {
                            bulletShotAnimationCoords.x = player.kineticImage.getX() + 22;
                            bulletShotAnimationCoords.y = player.kineticImage.getY() + 76;
                            break;
                        }
                    case CONSTANTS.FACING_DIRECTIONS.RIGHT:
                        {
                            bulletShotAnimationCoords.x = player.kineticImage.getX() + 130;
                            bulletShotAnimationCoords.y = player.kineticImage.getY() + 58;
                            break;
                        }
                    case CONSTANTS.FACING_DIRECTIONS.UP:
                        {
                            bulletShotAnimationCoords.x = player.kineticImage.getX() + 83;
                            bulletShotAnimationCoords.y = player.kineticImage.getY() + 115;
                            break;
                        }
                    case CONSTANTS.FACING_DIRECTIONS.DOWN:
                        {
                            bulletShotAnimationCoords.x = player.kineticImage.getX() + 68;
                            bulletShotAnimationCoords.y = player.kineticImage.getY() + 10;
                            break;
                        }
                    case CONSTANTS.FACING_DIRECTIONS.UP_LEFT:
                        {
                            bulletShotAnimationCoords.x = player.kineticImage.getX() + 31;
                            bulletShotAnimationCoords.y = player.kineticImage.getY() + 29;
                            break;
                        }
                    case CONSTANTS.FACING_DIRECTIONS.UP_RIGHT:
                        {
                            bulletShotAnimationCoords.x = player.kineticImage.getX() + 115;
                            bulletShotAnimationCoords.y = player.kineticImage.getY() + 36;
                            break;
                        }
                    case CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT:
                        {
                            bulletShotAnimationCoords.x = player.kineticImage.getX() + 24;
                            bulletShotAnimationCoords.y = player.kineticImage.getY() + 106;
                            break;
                        }
                    case CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT:
                        {
                            bulletShotAnimationCoords.x = player.kineticImage.getX() + 138;
                            bulletShotAnimationCoords.y = player.kineticImage.getY() + 108;
                            break;
                        }

                }

                runBulletShotAnimation(bulletShotAnimationCoords.x, bulletShotAnimationCoords.y, CONSTANTS.BULLET_SHOT_SCALE, CONSTANTS.BULLET_SHOT_FRAMERATE);
                createjs.Sound.play('gun');
            }
        });
    }

    function loadInitialEnemy() {
        enemyImageObj = new Image();

        enemyImageObj.onload = function() {
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

    function attackPlayer(enemy, player) {
        playerCenterX = player.kineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2;
        playerCenterY = player.kineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2;

        var enemyX = enemy.getX(),
            enemyY = enemy.getY();

        var rotation = Math.atan2(playerCenterY - enemyY, playerCenterX - enemyX);

        enemy.setX(enemyX + Math.cos(rotation) * CONSTANTS.ENEMY_SPEED);
        enemy.setY(enemyY + Math.sin(rotation) * CONSTANTS.ENEMY_SPEED);
    }

    function runDeathAnimation(targetX, targetY, scale, frameRate) {
        var frameCount = 0;
        explosionAnimation.setAnimation('explosion');
        explosionAnimation.setX(targetX - CONSTANTS.EXPLOSION_WIDTH / 2 * scale);
        explosionAnimation.setY(targetY - CONSTANTS.EXPLOSION_HEIGHT / 2 * scale);
        explosionAnimation.setScale({
            x: scale,
            y: scale
        });
        explosionAnimation.setFrameRate(frameRate);

        explosionAnimation.show();
        explosionAnimation.on('frameIndexChange', function(e) {
            if (frameCount === 0) {
                createjs.Sound.play('bomb');
            }

            if (++frameCount > CONSTANTS.PLAYER_DEATH_ANIMATION_FRAMES_COUNT - 1) {
                explosionAnimation.stop();
                explosionAnimation.hide();
                frameCount = 0;
            }
        });
        explosionAnimation.start();
    }

    function runBulletShotAnimation(targetX, targetY, scale, frameRate) {
        explosionAnimation.stop();
        var frameCount = 0;
        explosionAnimation.setAnimation('explosion');
        explosionAnimation.setX(targetX - CONSTANTS.EXPLOSION_WIDTH / 2 * scale);
        explosionAnimation.setY(targetY - CONSTANTS.EXPLOSION_HEIGHT / 2 * scale);
        explosionAnimation.setScale({
            x: scale,
            y: scale
        });
        explosionAnimation.setFrameRate(frameRate);

        explosionAnimation.show();
        explosionAnimation.on('frameIndexChange', function(e) {
            if (frameCount === 0) {
                //createjs.Sound.play('bomb');
            }

            if (++frameCount > CONSTANTS.PLAYER_DEATH_ANIMATION_FRAMES_COUNT - 1) {
                explosionAnimation.stop();
                explosionAnimation.hide();
                frameCount = 0;
            }
        });
        explosionAnimation.start();
    }

    function loadExplosionAnimation() {
        var deathObj = new Image();
        deathObj.onload = function() {
            explosionAnimation = new Kinetic.Sprite({
                x: 0,
                y: 0,
                image: deathObj,
                scale: {
                    x: 0,
                    y: 0
                },

                animation: 'explosion',
                animations: {
                    explosion: [
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

            playerLayer.add(explosionAnimation);
            explosionAnimation.hide();
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
        loadExplosionAnimation();
    }

    function run() {
        var gameLoop = setTimeout(function() {
            var smoothGameLoop = requestAnimationFrame(run);
            deathModeOn = decreasedLife === 0;

            // some code sets deathModeOn to true, i.e the hero has died
            if (deathModeOn) {
                runDeathAnimation(playerKineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2,
                    playerKineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2, CONSTANTS.EXPLOSION_SCALE, CONSTANTS.EXPLOSION_FRAME_RATE);
                cancelAnimationFrame(smoothGameLoop);
                clearTimeout(gameLoop);
                playerKineticImage.remove();
            }

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
                attackPlayer(enemies[i].enemy, player);
            }

            backgroundLayer.setZIndex(1);
            playerLayer.setZIndex(2);
            enemiesLayer.setZIndex(3);

            enemiesLayer.draw();
        }, 100);
    }

    (function() {
        initialize();
        run();
    }());
};
