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
        gameStateHelper: './helpers/game-state-helper',
    }
});

window.onload =
    requirejs(['globalConstants', 'playerConstants', 'enemyConstants',
            'game-objects/characters/hero', 'game-objects/characters/enemy',
            'game-objects/bullet',
            'health', 'gameStateHelper',
            'jquery', 'kinetic', 'create'
        ],
        function (GLOBAL_CONSTANTS, PLAYER_CONSTANTS, ENEMY_CONSTANTS, Hero, Enemy, Bullet, logHealth, gameStateHelper) {
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
                ordinaryFirePath = 'assets/images/bullet.png',
                sprayFirePath = 'assets/images/bullet-image.png',

                gameSpeed = 0;

            var qBtn = $('#qButton'),
                wBtn = $('#wButton'),
                eBtn = $('#eButton'),
                aBtn = $("#aButton"),
                qTimer = $("#qTimer"),
                wTimer = $("#wTimer"),
                eTimer = $("#eTimer"),
                aTimer = $("#aTimer"),
                activeButtons = [true, true, true, true];

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
                        gameStateHelper.runExplosionAt(bulletShotAnimationCoords.x, bulletShotAnimationCoords.y, PLAYER_CONSTANTS.BULLET_SHOT_SCALE, PLAYER_CONSTANTS.BULLET_SHOT_FRAMERATE, layer);
                        createjs.Sound.play('gun');
                    }
                }

                function onKeyDown(e) {
                    var keyPressed = e.keyCode ? e.keyCode : e.which;

                    if (keyPressed === GLOBAL_CONSTANTS.KEYS.Q ||
                        keyPressed === GLOBAL_CONSTANTS.KEYS.W ||
                        keyPressed === GLOBAL_CONSTANTS.KEYS.E) {
                    }

                    if (keyPressed === GLOBAL_CONSTANTS.KEYS.Q) {
                        if(activeButtons[0]) {
                            gameStateHelper.runPoofAt(player.getCenter().x, player.getCenter().y, 0.4, layer);
                            player.checkDirectionAndTeleport(player.smallTeleportationAmount);

                            (function () {
                                var counter = 3,
                                    intervalID;

                                intervalID = setInterval(function () {
                                    counter--;
                                    if (counter > 0) {
                                        activeButtons[0] = false;
                                        qTimer.empty();
                                        qTimer.append("<p>'Q' Delay: " + (counter) + " s</p>");
                                        qBtn.css({
                                            'opacity': '0.5'
                                        });
                                    }
                                    if (counter === 0) {
                                        qTimer.empty();
                                        clearInterval(counter);
                                        qBtn.css({
                                            'opacity': '1'
                                        });
                                        qTimer.append("<p>Ready to use</p>");
                                        activeButtons[0] = true;
                                        clearTimeout(intervalID);
                                    }
                                }, 1000);
                            })();
                        }
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.W) {
                        if(activeButtons[1]) {
                            gameStateHelper.runPoofAt(player.getCenter().x, player.getCenter().y, 0.4, layer);
                            player.checkDirectionAndTeleport(player.averageTeleportationAmount);

                            (function () {
                                var counter = 3,
                                    intervalID;

                                intervalID = setInterval(function () {
                                    counter--;
                                    if (counter > 0) {
                                        activeButtons[1] = false;
                                        wTimer.empty();
                                        wTimer.append("<p>'W' Delay: " + (counter) + " s</p>");
                                        wBtn.css({
                                            'opacity': '0.5'
                                        });
                                    }
                                    if (counter === 0) {
                                        wTimer.empty();
                                        clearInterval(counter);
                                        wBtn.css({
                                            'opacity': '1'
                                        });
                                        wTimer.append("<p>Ready to use</p>");
                                        activeButtons[1] = false;
                                        clearInterval(intervalID);
                                    }
                                }, 1000);
                            })();
                        }
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.E) {
                        if(activeButtons[2]) {
                            gameStateHelper.runPoofAt(player.getCenter().x, player.getCenter().y, 0.4, layer);
                            player.checkDirectionAndTeleport(player.largeTeleportationAmount);

                            (function () {
                                var counter = 3,
                                    intervalID;
                                intervalID = setInterval(function () {
                                    counter--;
                                    if (counter > 0) {
                                        activeButtons[2] = false;
                                        eTimer.empty();
                                        //e.preventDefault();
                                        eTimer.append("<p>'E' Delay: " + (counter) + " s</p>");
                                        eBtn.css({
                                            'opacity': '0.5'
                                        });
                                    }
                                    if (counter === 0) {
                                        eTimer.empty();
                                        clearInterval(counter);
                                        eBtn.css({
                                            'opacity': '1'
                                        });
                                        eTimer.append("<p>Ready to use</p>");
                                        activeButtons[2] = true;
                                        clearInterval(intervalID);
                                    }
                                }, 1000);
                            })();
                        }
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.A) {
                        if(activeButtons[3]) {
                            sprayBulletsOutwardsPlayer();

                            (function () {
                                var counter = 3,
                                    intervalID;
                                intervalID = setInterval(function () {
                                    counter--;
                                    if (counter > 0) {
                                        activeButtons[3] = false;
                                        aTimer.empty();
                                        //e.preventDefault();
                                        aTimer.append("<p>Delay: " + (counter) + " s</p>");
                                        aBtn.css({
                                            'opacity': '0.5'
                                        });
                                    }
                                    if (counter === 0) {
                                        clearInterval(counter);
                                        aBtn.css({
                                            'opacity': '1'
                                        });
                                        aTimer.append("<p>Ready to use</p>");
                                        activeButtons[3] = true;
                                        clearInterval(intervalID);
                                    }
                                }, 1000);
                            })();
                        }
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

            function getRandomCoordinate(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function shootBullet(gunBarrelX, gunBarrelY, bulletDestinationX, bulletDestinationY, bulletImagePath) {
                var bullet = new Bullet(gunBarrelX, gunBarrelY, bulletImagePath);
                bullet.shoot(bulletDestinationX,bulletDestinationY,enemies, player, stage, ammoLayer, layer, score);
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
            }

            function updateScore() {
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
                        gameStateHelper.runExplosionAt(player.kineticImage.getX() + PLAYER_CONSTANTS.WIDTH / 2,
                            player.kineticImage.getY() + PLAYER_CONSTANTS.HEIGHT / 2,
                            PLAYER_CONSTANTS.EXPLOSION_SCALE, PLAYER_CONSTANTS.EXPLOSION_FRAME_RATE, layer);
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

                    // Update score
                    updateScore();

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