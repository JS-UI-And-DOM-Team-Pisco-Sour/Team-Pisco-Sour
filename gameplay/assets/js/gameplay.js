requirejs.config({
    baseUrl: 'assets/js',
    paths: {
        app: 'gameplay'
    }
});

window.onload =
    requirejs(['constants', 'game-objects/hero', '../../../lib/jquery-1.11.3.min', '../../lib/kinetic-v5.1.0.min',
            '../../../lib/createjs-2015.05.21.min',
            'health'],
        function start(CONSTANTS, hero) {
            function loadSounds() {
                createjs.Sound.registerSound('assets/sounds/boom.mp3', 'bomb');
                createjs.Sound.registerSound('assets/sounds/gunfire.mp3', 'gun');
            }

            var stage,
                backgroundLayer,
                playerLayer,
                enemiesLayer,

                backgroundImageObj,
                enemyImageObj,

                player,
                playerCenterX,
                playerCenterY,

                enemies = [],

            //playerAutoPosition,
            //playerLineEquation,

                currentFrame = -1,

                deathModeOn = false;


            function loadCanvas() {
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
                player = Object.create(hero).init('assets/images/player.png', CONSTANTS.PLAYER_INITIAL_HEALTH, playerLayer);
                player.image.onload = function () {
                    var playerKineticImage = new Kinetic.Image({
                        x: 50,
                        y: 50,
                        image: player.image,
                        width: CONSTANTS.PLAYER_WIDTH,
                        height: CONSTANTS.PLAYER_HEIGHT,
                        crop: {
                            x: CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT * CONSTANTS.PLAYER_WIDTH,
                            y: 0,
                            width: CONSTANTS.PLAYER_WIDTH,
                            height: CONSTANTS.PLAYER_HEIGHT
                        }
                    });

                    player.kineticImage = playerKineticImage;

                    addKeystrokeListener();
                    addMouseEventListeners();
                    playerLayer.add(player.kineticImage);
                    stage.add(playerLayer);
                };
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
                $(document).keyup(function (e) {
                    var keyPressed = e.keyCode ? e.keyCode : e.which;

                    if (keyPressed === CONSTANTS.KEYS.Q) {
                        player.checkDirectionAndTeleport(100);
                    } else if (keyPressed === CONSTANTS.KEYS.W) {
                        player.checkDirectionAndTeleport(200);
                    } else if (keyPressed === CONSTANTS.KEYS.E) {
                        player.checkDirectionAndTeleport(300);
                    } else if (keyPressed === CONSTANTS.KEYS.A) {
                        // TODO: Raise Hell
                    }
                });
            }

            function addMouseEventListeners() {
                stage.addEventListener('mousemove', function (e) {
                    var $gameplayContainer = $('#gameplay-container'),
                        relativeClientX = e.clientX - $gameplayContainer.offset().left,
                        relativeClientY = e.clientY - $gameplayContainer.offset().top;
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
                stage.addEventListener('mousedown', function (e) {
                    e = e || window.event; // for IE
                    var isRightClick;
                    if ('which' in e) {
                        isRightClick = e.which === 3;
                    } else if ('button' in e) { // for IE
                        isRightClick = e.button === 2;
                    }

                    if (!isRightClick) {
                        var bulletShotAnimationCoords = {};
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

            function loadEnemy() {
                enemyImageObj = new Image();
                enemyImageObj.src = "assets/images/enemy.png";
                enemies = [];
            }

            function attackPlayer(enemy) {
                playerCenterX = player.kineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2;
                playerCenterY = player.kineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2;

                var enemyX = enemy.getX(),
                    enemyY = enemy.getY(),
                    rotation = Math.atan2(playerCenterY - enemyY, playerCenterX - enemyX);

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
                explosionAnimation.on('frameIndexChange', function (e) {
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
                explosionAnimation.on('frameIndexChange', function (e) {
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
                deathObj.onload = function () {
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
                loadSounds();
                loadCanvas();
                loadBackground();
                loadPlayer();
                loadEnemy();
                loadExplosionAnimation();
            }

            function run() {
                var gameLoop = setTimeout(function () {
                    var smoothGameLoop = requestAnimationFrame(run);
                    deathModeOn = health === 0;

                    // some code sets deathModeOn to true, i.e the hero has died
                    if (deathModeOn) {
                        runDeathAnimation(player.kineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2,
                            player.kineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2, CONSTANTS.EXPLOSION_SCALE, CONSTANTS.EXPLOSION_FRAME_RATE);
                        cancelAnimationFrame(smoothGameLoop);
                        clearTimeout(gameLoop);
                        player.kineticImage.remove();
                    }

                    // Spawning an enemy each frame
                    if (currentFrame % CONSTANTS.ENEMY_SPAWN_FRAME_INTERVAL === 0) {
                        var newEnemy = new Kinetic.Image({
                            x: getRandomCoordinate(50, 950),
                            y: getRandomCoordinate(50, 600),
                            image: enemyImageObj,
                            width: CONSTANTS.ENEMY_WIDTH,
                            height: CONSTANTS.ENEMY_HEIGHT,
                            crop: {
                                x: currentFrame,
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
                        stage.add(enemiesLayer);
                    }

                    // Updating each Enemy separately
                    for (var i = 0, len = enemies.length; i < len; i += 1) {
                        var currentEnemyFrame = (currentFrame - enemies[i].frame) / 3 | 0;
                        if (currentEnemyFrame < CONSTANTS.ENEMY_FRAME_COUNT - 1) {
                            enemies[i].enemy.setCrop({
                                x: currentEnemyFrame * CONSTANTS.ENEMY_WIDTH,
                                y: 0,
                                width: CONSTANTS.ENEMY_WIDTH,
                                height: CONSTANTS.ENEMY_HEIGHT
                            });
                        }

                        attackPlayer(enemies[i].enemy);
                    }

                    backgroundLayer.setZIndex(1);
                    playerLayer.setZIndex(2);
                    enemiesLayer.setZIndex(3);
                    enemiesLayer.draw();

                    //Last step is to update the frame counter
                    currentFrame += 1;
                }, 30);
            }

            (function () {
                initialize();
                run();
            }());
        }
    );