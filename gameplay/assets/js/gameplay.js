requirejs.config({
    baseUrl: 'assets/js',
    paths: {
        app: 'gameplay',
        jquery: '../../../lib/jquery-1.11.3.min',
        create: '../../../lib/createjs-2015.05.21.min',
        kinetic: '../../lib/kinetic-v5.1.0.min',
        globalConstants: './common/global-constants',
        playerConstants: './common/player-constants',
        enemyConstants: './common/enemy-constants',
        gameStateHelper: './helpers/game-state-helper'
    }
});

window.onload =
    requirejs(['globalConstants', 'playerConstants', 'enemyConstants',
            'game-objects/hero', 'game-objects/enemy',
            'health', 'gameStateHelper', 'buttonTimer',
            'jquery', 'kinetic', 'create'
        ],
        function (GLOBAL_CONSTANTS, PLAYER_CONSTANTS, ENEMY_CONSTANTS, Hero, Enemy, logHealth, gameStateHelper) {
            var stage,
                backgroundLayer,
                playerLayer,
                enemiesLayer,
                ammoLayer,
                backgroundImageObj,
                layer,

                player,
                playerCenter,

                enemies = [],

                currentFrame = 0,
                score = 0,
                bulletOffset = 20,
                secondArrayBulletOffset = 35,
                ordinaryFirePath = 'assets/images/bullet.png',
                sprayFirePath = 'assets/images/bullet-image.png',

                gameSpeed = 0;

            function loadSounds() {
                createjs.Sound.registerSound('assets/sounds/boom.mp3', 'bomb');
                createjs.Sound.registerSound('assets/sounds/gunfire.mp3', 'gun');
            }

            function loadCanvas() {
                stage = new Kinetic.Stage({
                    container: 'gameplay-container',
                    width: GLOBAL_CONSTANTS.STAGE_WIDTH,
                    height: GLOBAL_CONSTANTS.STAGE_HEIGHT
                });

                backgroundLayer = new Kinetic.Layer();
                ammoLayer = new Kinetic.FastLayer();
                enemiesLayer = new Kinetic.FastLayer();
                playerLayer = new Kinetic.FastLayer();
                layer = new Kinetic.FastLayer();

                stage.add(ammoLayer);
                stage.add(enemiesLayer);
                stage.add(layer);
            }

            function loadPlayer() {

                player = new Hero('assets/images/player.png', PLAYER_CONSTANTS.INITIAL_HEALTH, playerLayer, PLAYER_CONSTANTS.ATTACK_SPEED);
                player.loadToStage(stage);
            }

            function loadBackground() {
                backgroundImageObj = new Image();

                backgroundImageObj.onload = function () {
                    var background = new Kinetic.Image({
                        x: 0,
                        y: 0,
                        image: backgroundImageObj,
                        width: GLOBAL_CONSTANTS.STAGE_WIDTH,
                        height: GLOBAL_CONSTANTS.STAGE_HEIGHT
                    });

                    backgroundLayer.add(background);
                    stage.add(backgroundLayer);
                };

                backgroundImageObj.src = "assets/images/canvas-bg.jpg";
            }

            function addEventListeners() {
                stage.addEventListener('mousemove', onMouseMove);
                stage.addEventListener('mousedown', onMouseDown);
                $(document).on('keydown', onKeyDown);

                function onMouseMove(e) {
                    var $gameplayContainer = $('#gameplay-container'),
                        relativeClientX = e.clientX - $gameplayContainer.offset().left,
                        relativeClientY = e.clientY - $gameplayContainer.offset().top,
                        playerCenterX = player.getCenter().x,
                        playerCenterY = player.getCenter().y;

                    // Left
                    if (relativeClientX < playerCenterX) {
                        if (Math.abs(relativeClientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - relativeClientX)) {
                            if (player.facingDirection !== PLAYER_CONSTANTS.FACING_DIRECTIONS.LEFT) {
                                player.kineticImage.setCrop({
                                    x: PLAYER_CONSTANTS.FACING_DIRECTIONS.LEFT * PLAYER_CONSTANTS.WIDTH,
                                    y: 0,
                                    width: PLAYER_CONSTANTS.WIDTH,
                                    height: PLAYER_CONSTANTS.HEIGHT
                                });
                                player.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.LEFT;
                            }
                        }
                    }

                    // Right
                    if (relativeClientX > playerCenterX) {
                        if (Math.abs(relativeClientY - playerCenterY) < Math.tan(22.5 / 180 * Math.PI) * (relativeClientX - playerCenterX)) {
                            if (player.facingDirection !== PLAYER_CONSTANTS.FACING_DIRECTIONS.RIGHT) {
                                player.kineticImage.setCrop({
                                    x: PLAYER_CONSTANTS.FACING_DIRECTIONS.RIGHT * PLAYER_CONSTANTS.WIDTH,
                                    y: 0,
                                    width: PLAYER_CONSTANTS.WIDTH,
                                    height: PLAYER_CONSTANTS.HEIGHT
                                });
                                player.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.RIGHT;
                            }
                        }
                    }

                    // Down
                    if (relativeClientY < playerCenterY) {
                        if (Math.abs(relativeClientX - playerCenterX) < Math.tan(22.5 / 180 * Math.PI) * (playerCenterY - relativeClientY)) {
                            if (player.facingDirection !== PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN) {
                                player.kineticImage.setCrop({
                                    x: PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN * PLAYER_CONSTANTS.WIDTH,
                                    y: 0,
                                    width: PLAYER_CONSTANTS.WIDTH,
                                    height: PLAYER_CONSTANTS.HEIGHT
                                });
                                player.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN;
                            }
                        }
                    }

                    // Up
                    if (relativeClientY > playerCenterY) {
                        if (Math.abs(relativeClientX - playerCenterX) < Math.tan(22.5 / 180 * Math.PI) * (relativeClientY - playerCenterY)) {
                            if (player.facingDirection !== PLAYER_CONSTANTS.FACING_DIRECTIONS.UP) {
                                player.kineticImage.setCrop({
                                    x: PLAYER_CONSTANTS.FACING_DIRECTIONS.UP * PLAYER_CONSTANTS.WIDTH,
                                    y: 0,
                                    width: PLAYER_CONSTANTS.WIDTH,
                                    height: PLAYER_CONSTANTS.HEIGHT
                                });
                                player.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.UP;
                            }
                        }
                    }

                    // Up-Left
                    if (relativeClientX < playerCenterX) {

                        if (playerCenterY - relativeClientY > Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - relativeClientX) &&
                            playerCenterY - relativeClientY < Math.tan(67.5 / 180 * Math.PI) * (playerCenterX - relativeClientX)) {
                            if (player.facingDirection !== PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_LEFT) {
                                player.kineticImage.setCrop({
                                    x: PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_LEFT * PLAYER_CONSTANTS.WIDTH,
                                    y: 0,
                                    width: PLAYER_CONSTANTS.WIDTH,
                                    height: PLAYER_CONSTANTS.HEIGHT
                                });
                                player.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_LEFT;
                            }
                        }
                    }

                    // Down-Left
                    if (relativeClientX < playerCenterX) {
                        if (relativeClientY - playerCenterY > Math.tan(22.5 / 180 * Math.PI) * (playerCenterX - relativeClientX) &&
                            relativeClientY - playerCenterY < Math.tan(67.5 / 180 * Math.PI) * (playerCenterX - relativeClientX)) {
                            if (player.facingDirection !== PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT) {
                                player.kineticImage.setCrop({
                                    x: PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT * PLAYER_CONSTANTS.WIDTH,
                                    y: 0,
                                    width: PLAYER_CONSTANTS.WIDTH,
                                    height: PLAYER_CONSTANTS.HEIGHT
                                });
                                player.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT;
                            }
                        }
                    }

                    // Up-Right
                    if (relativeClientX > playerCenterX) {
                        if (playerCenterY - relativeClientY > Math.tan(22.5 / 180 * Math.PI) * (relativeClientX - playerCenterX) &&
                            playerCenterY - relativeClientY < Math.tan(67.5 / 180 * Math.PI) * (relativeClientX - playerCenterX)) {
                            if (player.facingDirection !== PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_RIGHT) {
                                player.kineticImage.setCrop({
                                    x: PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_RIGHT * PLAYER_CONSTANTS.WIDTH,
                                    y: 0,
                                    width: PLAYER_CONSTANTS.WIDTH,
                                    height: PLAYER_CONSTANTS.HEIGHT
                                });
                                player.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_RIGHT;
                            }
                        }
                    }

                    // Down-Right
                    if (relativeClientX > playerCenterX) {
                        if (relativeClientY - playerCenterY > Math.tan(22.5 / 180 * Math.PI) * (relativeClientX - playerCenterX) &&
                            relativeClientY - playerCenterY < Math.tan(67.5 / 180 * Math.PI) * (relativeClientX - playerCenterX)) {
                            if (player.facingDirection !== PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT) {
                                player.kineticImage.setCrop({
                                    x: PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT * PLAYER_CONSTANTS.WIDTH,
                                    y: 0,
                                    width: PLAYER_CONSTANTS.WIDTH,
                                    height: PLAYER_CONSTANTS.HEIGHT
                                });
                                player.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT;
                            }
                        }
                    }

                    playerLayer.draw();
                }

                function onMouseDown(e) {
                    e = e || window.event; // for IE
                    var isRightClick;
                    if ('which' in e) {
                        isRightClick = e.which === 3;
                    } else if ('button' in e) { // for IE
                        isRightClick = e.button === 2;
                    }

                    if (!isRightClick) {
                        var $gameplayContainer = $('#gameplay-container'),
                            relativeClientX = e.clientX - $gameplayContainer.offset().left,
                            relativeClientY = e.clientY - $gameplayContainer.offset().top;

                        var bulletShotAnimationCoords = {};

                        switch (player.facingDirection) {
                            case PLAYER_CONSTANTS.FACING_DIRECTIONS.LEFT:
                            {
                                bulletShotAnimationCoords.x = player.kineticImage.getX() + 22;
                                bulletShotAnimationCoords.y = player.kineticImage.getY() + 76;
                                break;
                            }
                            case PLAYER_CONSTANTS.FACING_DIRECTIONS.RIGHT:
                            {
                                bulletShotAnimationCoords.x = player.kineticImage.getX() + 130;
                                bulletShotAnimationCoords.y = player.kineticImage.getY() + 58;
                                break;
                            }
                            case PLAYER_CONSTANTS.FACING_DIRECTIONS.UP:
                            {
                                bulletShotAnimationCoords.x = player.kineticImage.getX() + 83;
                                bulletShotAnimationCoords.y = player.kineticImage.getY() + 115;
                                break;
                            }
                            case PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN:
                            {
                                bulletShotAnimationCoords.x = player.kineticImage.getX() + 68;
                                bulletShotAnimationCoords.y = player.kineticImage.getY() + 10;
                                break;
                            }
                            case PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_LEFT:
                            {
                                bulletShotAnimationCoords.x = player.kineticImage.getX() + 31;
                                bulletShotAnimationCoords.y = player.kineticImage.getY() + 29;
                                break;
                            }
                            case PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_RIGHT:
                            {
                                bulletShotAnimationCoords.x = player.kineticImage.getX() + 115;
                                bulletShotAnimationCoords.y = player.kineticImage.getY() + 36;
                                break;
                            }
                            case PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT:
                            {
                                bulletShotAnimationCoords.x = player.kineticImage.getX() + 24;
                                bulletShotAnimationCoords.y = player.kineticImage.getY() + 106;
                                break;
                            }
                            case PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT:
                            {
                                bulletShotAnimationCoords.x = player.kineticImage.getX() + 138;
                                bulletShotAnimationCoords.y = player.kineticImage.getY() + 108;
                                break;
                            }
                        }

                        shootBullet(bulletShotAnimationCoords.x, bulletShotAnimationCoords.y, relativeClientX, relativeClientY, ordinaryFirePath);
                        runExplosionAt(bulletShotAnimationCoords.x, bulletShotAnimationCoords.y, PLAYER_CONSTANTS.BULLET_SHOT_SCALE, PLAYER_CONSTANTS.BULLET_SHOT_FRAMERATE);
                        createjs.Sound.play('gun');
                    }
                }

                function onKeyDown(e) {
                    var keyPressed = e.keyCode ? e.keyCode : e.which;

                    if (keyPressed === GLOBAL_CONSTANTS.KEYS.Q ||
                        keyPressed === GLOBAL_CONSTANTS.KEYS.W ||
                        keyPressed === GLOBAL_CONSTANTS.KEYS.E) {
                        //runDisappearanceAnimation(player.getCenter().x, player.getCenter().y, 0.4, 30);
                        runPoofAt(player.getCenter().x, player.getCenter().y, 0.4);
                    }

                    if (keyPressed === GLOBAL_CONSTANTS.KEYS.Q) {
                        player.checkDirectionAndTeleport(player.smallTeleportationAmount);
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.W) {
                        player.checkDirectionAndTeleport(player.averageTeleportationAmount);
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.E) {
                        player.checkDirectionAndTeleport(player.largeTeleportationAmount);
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.A) {
                        sprayBulletsOutwardsPlayer();
                    }
                }
            }

            function removeEventListeners() {
                stage.off('mousedown');
                stage.off('mouseover');
                $(document).off('keydown');
            }

            function spawnEnemy(frame) {
                var creature = new Enemy('assets/images/enemy.png', frame);
                creature.image.onload = function () {
                    var newEnemy = new Kinetic.Image({
                        x: getRandomCoordinate(50, 950 - ENEMY_CONSTANTS.WIDTH),
                        y: getRandomCoordinate(50, 600 - ENEMY_CONSTANTS.HEIGHT),
                        image: creature.image,
                        width: ENEMY_CONSTANTS.WIDTH,
                        height: ENEMY_CONSTANTS.HEIGHT,
                        crop: {
                            x: creature.frame,
                            y: 0,
                            width: ENEMY_CONSTANTS.WIDTH,
                            height: ENEMY_CONSTANTS.HEIGHT
                        },

                        scale: {
                            x: ENEMY_CONSTANTS.SCALE,
                            y: ENEMY_CONSTANTS.SCALE
                        }
                    });

                    enemies.push({
                        enemy: newEnemy,
                        frame: creature.frame,
                        attackPlayer: creature.attackPlayer
                    });

                    enemiesLayer.add(newEnemy);
                }
            }

            function runExplosionAt(x, y, scale, frameRate) {
                var frameX = 0, frameY = 0;
                var image;
                var explosion = new Image();
                image = new Kinetic.Image({
                    x: x - PLAYER_CONSTANTS.EXPLOSION_WIDTH / 2 * scale,
                    y: y - PLAYER_CONSTANTS.EXPLOSION_HEIGHT / 2 * scale,
                    image: explosion,
                    width: 256,
                    height: 256,
                    crop: {
                        x: 0,
                        y: 0,
                        width: 256,
                        height: 256
                    }
                });

                layer.add(image);

                explosion.src = 'assets/images/explosion.png';
                function run() {
                    image.setX(x - PLAYER_CONSTANTS.EXPLOSION_WIDTH / 2 * scale);
                    image.setY(y - PLAYER_CONSTANTS.EXPLOSION_HEIGHT / 2 * scale);
                    image.setCrop({
                        x: frameX * 256,
                        y: frameY * 256,
                        width: 256,
                        height: 256
                    });
                    image.setScale({
                        x: scale,
                        y: scale
                    });

                    layer.draw();
                    frameX++;
                    if (frameX % 8 === 0) {
                        frameX = 0;
                        frameY++;
                    }

                    if (frameY === 6) {
                        clearTimeout(mariika);
                    }

                    var mariika = setTimeout(run, frameRate);
                }

                run();
            }

            function runPoofAt(x, y, scale) {
                var frameX = 0, frameY = 0;
                var image;
                var poof = new Image();
                image = new Kinetic.Image({
                    x: x - PLAYER_CONSTANTS.EXPLOSION_WIDTH / 2 * scale,
                    y: y - PLAYER_CONSTANTS.EXPLOSION_HEIGHT / 2 * scale,
                    image: poof,
                    width: 256,
                    height: 256,
                    crop: {
                        x: 0,
                        y: 0,
                        width: 256,
                        height: 256
                    }
                });

                layer.add(image);

                poof.src = 'assets/images/poof.png';
                (function run() {
                    image.setX(x - PLAYER_CONSTANTS.EXPLOSION_WIDTH / 2 * scale);
                    image.setY(y - PLAYER_CONSTANTS.EXPLOSION_HEIGHT / 2 * scale);
                    image.setCrop({
                        x: frameX * 128,
                        y: (4 - frameY) * 128,
                        width: 128,
                        height: 128
                    });

                    image.setScale({
                        x: scale,
                        y: scale
                    });

                    layer.draw();
                    frameY++;
                    if (frameY === 6) {
                        cancelAnimationFrame(mariika);
                        clearTimeout(animationControl);
                    }
                    var mariika = requestAnimationFrame(run);
                }());
            }

            function getRandomCoordinate(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function createBullet(gunBarrelX, gunBarrelY, bulletImagePath) {
                var bulletImageObject = new Image();
                var bulletKineticImage = new Kinetic.Image({
                    x: gunBarrelX,
                    y: gunBarrelY,
                    image: bulletImageObject,
                    width: 28,
                    height: 28,
                    crop: {
                        x: 0,
                        y: 0,
                        width: 128,
                        height: 128
                    }
                });

                bulletImageObject.onload = function () {
                    ammoLayer.add(bulletKineticImage); // ammoLayer has now length of 1
                    stage.add(ammoLayer);
                };

                bulletImageObject.src = bulletImagePath;

                return bulletKineticImage;
            }

            function shootBullet(gunBarrelX, gunBarrelY, bulletDestinationX, bulletDestinationY, bulletImagePath) {
                var bullet = createBullet(gunBarrelX, gunBarrelY, bulletImagePath);
                ammoLayer.add(bullet);

                var targetX = bulletDestinationX - bullet.getX(),
                    targetY = bulletDestinationY - bullet.getY(),
                    distance = Math.sqrt(targetX * targetX + targetY * targetY);

                var velocityX = (targetX / distance) * player.attackSpeed,
                    velocityY = (targetY / distance) * player.attackSpeed;

                var bulletShotAnimation = new Kinetic.Animation(function (frame) {
                    bullet.setX(bullet.getX() + velocityX);
                    bullet.setY(bullet.getY() + velocityY);

                    var deadEnemyIndex = gameStateHelper.getDeadEnemyIndex(enemies, bullet),
                        bulletHasLeftField = gameStateHelper.bulletLeftField(bullet);

                    if (deadEnemyIndex) {
                        // The three magic rows that save the whole of the universe. Amin.
                        bullet.setX(GLOBAL_CONSTANTS.STAGE_WIDTH * 2);
                        bullet.setY(GLOBAL_CONSTANTS.STAGE_HEIGHT * 2);
                        bullet.destroy();

                        runExplosionAt(enemies[deadEnemyIndex].enemy.getX(), enemies[deadEnemyIndex].enemy.getY(), 0.6, 5);
                        gameStateHelper.removeEnemy(enemies, deadEnemyIndex);

                        // Lifesteal ability
                        if (player.health < 1000) {
                            // Using '-' sign, so that the damage is inverted and the value is actually added to the player's health points
                            logHealth(-PLAYER_CONSTANTS.HEALTH_INCREASED_ON_ENEMY_HIT, player);
                        }

                        // Update score count
                        score += 1;

                        $("#scoreSpan").text(score);

                        var name = sessionStorage.getItem('heroName');
                        sessionStorage.playerScore = Number(sessionStorage.playerScore) + 1;
                        var highestScore = sessionStorage.playerScore;
                        if (localStorage.highestScore) {
                            // If player score is greater-than top scorer then
                            // update its score as a top scorer.
                            if (highestScore >= localStorage.highestScore) {
                                setHighScore(name, highestScore);
                            }
                        } else {
                            setHighScore(name, highestScore);
                        }

                        function setHighScore(name, newScore) {
                            //save the winner score and name to local storage
                            localStorage.highestScore = newScore;
                            localStorage.highScorerName = name;
                        }
                    }

                    if (bulletHasLeftField) {
                        bullet.destroy();
                    }

                }, ammoLayer);

                bulletShotAnimation.start();
            }

            function sprayBulletsOutwardsPlayer() {
                playerCenter = player.getCenter();

                shootBullet(playerCenter.x, playerCenter.y - bulletOffset,
                    playerCenter.x, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x + bulletOffset / 3, playerCenter.y - bulletOffset / 3,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH / 3, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x + bulletOffset / 2, playerCenter.y - bulletOffset / 2,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH / 2, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT / 2, sprayFirePath);

                shootBullet(playerCenter.x + bulletOffset, playerCenter.y,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH, playerCenter.y, sprayFirePath);

                shootBullet(playerCenter.x + bulletOffset / 3, playerCenter.y + bulletOffset / 3,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH / 3, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x + bulletOffset / 2, playerCenter.y + bulletOffset / 2,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH / 2, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT / 2, sprayFirePath);

                shootBullet(playerCenter.x, playerCenter.y + bulletOffset,
                    playerCenter.x, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x - bulletOffset / 3, playerCenter.y + bulletOffset / 3,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH / 3, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x - bulletOffset / 2, playerCenter.y + bulletOffset / 2,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH / 2, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT / 2, sprayFirePath);

                shootBullet(playerCenter.x - bulletOffset, playerCenter.y,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH, playerCenter.y, sprayFirePath);

                shootBullet(playerCenter.x - bulletOffset / 3, playerCenter.y - bulletOffset / 3,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH / 3, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x - bulletOffset / 2, playerCenter.y - bulletOffset / 2,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH / 2, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT / 2, sprayFirePath);

                // sec
                shootBullet(playerCenter.x, playerCenter.y - secondArrayBulletOffset,
                    playerCenter.x, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x + bulletOffset / 3, playerCenter.y - secondArrayBulletOffset / 3,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH / 3.5, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x + secondArrayBulletOffset / 2, playerCenter.y - secondArrayBulletOffset / 2,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH / 2.5, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT / 2, sprayFirePath);

                shootBullet(playerCenter.x + secondArrayBulletOffset, playerCenter.y,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH, playerCenter.y, sprayFirePath);

                shootBullet(playerCenter.x + secondArrayBulletOffset / 3, playerCenter.y + secondArrayBulletOffset / 3,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH / 3.5, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x + secondArrayBulletOffset / 2, playerCenter.y + secondArrayBulletOffset / 2,
                    playerCenter.x + GLOBAL_CONSTANTS.STAGE_WIDTH / 2.5, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT / 2, sprayFirePath);

                shootBullet(playerCenter.x, playerCenter.y + bulletOffset,
                    playerCenter.x, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x - secondArrayBulletOffset / 3, playerCenter.y + secondArrayBulletOffset / 3,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH / 3.5, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x - secondArrayBulletOffset / 2, playerCenter.y + secondArrayBulletOffset / 2,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH / 2.5, playerCenter.y + GLOBAL_CONSTANTS.STAGE_HEIGHT / 2, sprayFirePath);

                shootBullet(playerCenter.x - secondArrayBulletOffset, playerCenter.y,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH, playerCenter.y, sprayFirePath);

                shootBullet(playerCenter.x - secondArrayBulletOffset / 3, playerCenter.y - secondArrayBulletOffset / 3,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH / 3.5, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT, sprayFirePath);

                shootBullet(playerCenter.x - secondArrayBulletOffset / 2, playerCenter.y - secondArrayBulletOffset / 2,
                    playerCenter.x - GLOBAL_CONSTANTS.STAGE_WIDTH / 2.5, playerCenter.y - GLOBAL_CONSTANTS.STAGE_HEIGHT / 2, sprayFirePath);
            }

            function initialize() {
                loadSounds();
                loadCanvas();
                loadBackground();
                loadPlayer();
                addEventListeners();
            }

            function run() {
                var gameLoopControl = setTimeout(function () {
                    var gameLoop = requestAnimationFrame(run);

                    // Check if not dead
                    player.isDead = player.health <= 0;

                    if (player.isDead) {
                        removeEventListeners();
                        cancelAnimationFrame(gameLoop);
                        clearTimeout(gameLoopControl);
                        playerLayer.clear();
                        player.kineticImage.remove();
                        runExplosionAt(player.kineticImage.getX() + PLAYER_CONSTANTS.WIDTH / 2,
                            player.kineticImage.getY() + PLAYER_CONSTANTS.HEIGHT / 2,
                            PLAYER_CONSTANTS.EXPLOSION_SCALE, PLAYER_CONSTANTS.EXPLOSION_FRAME_RATE);
                        createjs.Sound.play('bomb');

                        // Delay the endscreen show-up
                        setTimeout(function () {
                            stage.remove(enemiesLayer);
                            window.location.href = '../termination/termination.html';
                        }, 3000);
                    }

                    // Spawning an enemy each frame
                    if (currentFrame % ENEMY_CONSTANTS.SPAWN_FRAME_INTERVAL === 0) {
                        spawnEnemy(currentFrame);
                    }

                    // Updating each Enemy separately
                    for (var i = 0, len = enemies.length; i < len; i += 1) {
                        var currentEnemyFrame = (currentFrame - enemies[i].frame) / 3 | 0;
                        if (currentEnemyFrame < ENEMY_CONSTANTS.FRAME_COUNT - 1) {
                            enemies[i].enemy.setCrop({
                                x: currentEnemyFrame * ENEMY_CONSTANTS.WIDTH,
                                y: 0,
                                width: ENEMY_CONSTANTS.WIDTH,
                                height: ENEMY_CONSTANTS.HEIGHT
                            });
                        }

                        Enemy.prototype.attackPlayer.call(enemies[i].enemy, player.kineticImage);

                        var playerEnemyCollision = gameStateHelper.checkIfPlayerCollidedWithEnemy(player, enemies[i].enemy);
                        if (playerEnemyCollision) {
                            logHealth(PLAYER_CONSTANTS.HEALTH_REDUCED_ON_ENEMY_COLLISION, player);
                            gameStateHelper.removeEnemy(enemies, i);
                        }
                    }

                    // The right way to set z indices
                    backgroundLayer.moveToTop();
                    ammoLayer.moveToTop();
                    playerLayer.moveToTop();
                    enemiesLayer.moveToTop();
                    layer.moveToTop();

                    // Draw only the layer that needs update
                    enemiesLayer.drawScene();

                    //Last step is to update the frame counter
                    currentFrame += 1;

                    // Clear the cache for better performance
                    ammoLayer.clearCache();
                    enemiesLayer.clearCache();
                    playerLayer.clearCache();
                    backgroundLayer.clearCache();

                    stage.clearCache();

                    if (currentFrame % 50 === 0) {
                        layer.destroyChildren();
                    }
                }, 30 - gameSpeed);
            }

            (function () {
                initialize();
                run();
            }());
        });