requirejs.config({
    baseUrl: 'assets/js',
    paths: {
        app: 'gameplay',
        jquery: '../../../lib/jquery-1.11.3.min',
        create: '../../../lib/createjs-2015.05.21.min',
        kinetic: '../../lib/kinetic-v5.1.0.min',
        globalConstants: './common/global-constants',
        playerConstants: './common/player-constants',
        enemyConstants: './common/enemy-constants'
    }
});

window.onload =
    requirejs(['globalConstants', 'playerConstants', 'enemyConstants',
            'game-objects/hero', 'game-objects/enemy',
            'health', 'buttonTimer',
            'jquery', 'kinetic', 'create'
        ],
        function(GLOBAL_CONSTANTS, PLAYER_CONSTANTS, ENEMY_CONSTANTS, Hero, Enemy, logHealth) {
            var stage,
                backgroundLayer,
                playerLayer,
                enemiesLayer,
                ammoLayer,
                backgroundImageObj,

                disappearanceAnimation,
                explosionAnimation,

                player,

                enemies = [],

                currentFrame = 0,
                playerWasHit = true,
                score = 0;

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
                ammoLayer = new Kinetic.Layer();
                enemiesLayer = new Kinetic.Layer();
                playerLayer = new Kinetic.Layer();

                stage.add(ammoLayer);
                stage.add(enemiesLayer);

            }

            function loadPlayer() {

                player = new Hero('assets/images/player.png', PLAYER_CONSTANTS.INITIAL_HEALTH, playerLayer, PLAYER_CONSTANTS.ATTACK_SPEED);
                player.loadToStage(stage);
            }

            function loadBackground() {
                backgroundImageObj = new Image();

                backgroundImageObj.onload = function() {
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

                        shootBullet(bulletShotAnimationCoords.x, bulletShotAnimationCoords.y, relativeClientX, relativeClientY);
                        runBulletShotAnimation(bulletShotAnimationCoords.x, bulletShotAnimationCoords.y, PLAYER_CONSTANTS.BULLET_SHOT_SCALE, PLAYER_CONSTANTS.BULLET_SHOT_FRAMERATE);
                        createjs.Sound.play('gun');
                    }
                }

                function onKeyDown(e) {
                    var keyPressed = e.keyCode ? e.keyCode : e.which;

                    if (keyPressed === GLOBAL_CONSTANTS.KEYS.Q || keyPressed === GLOBAL_CONSTANTS.KEYS.W ||
                        keyPressed === GLOBAL_CONSTANTS.KEYS.E || keyPressed === GLOBAL_CONSTANTS.KEYS.A) {
                        runDisappearanceAnimation(player.getCenter().x, player.getCenter().y, 0.4, 30);
                    }

                    if (keyPressed === GLOBAL_CONSTANTS.KEYS.Q) {
                        player.checkDirectionAndTeleport(player.smallTeleportationAmount);
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.W) {
                        player.checkDirectionAndTeleport(player.averageTeleportationAmount);
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.E) {
                        player.checkDirectionAndTeleport(player.largeTeleportationAmount);
                    } else if (keyPressed === GLOBAL_CONSTANTS.KEYS.A) {
                        // TODO: Raise Hell
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
                creature.image.onload = function() {
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

            function runDeathAnimation(targetX, targetY, scale, frameRate) {
                var frameCount = 0;
                explosionAnimation.setAnimation('explosion');
                explosionAnimation.setX(targetX - PLAYER_CONSTANTS.EXPLOSION_WIDTH / 2 * scale);
                explosionAnimation.setY(targetY - PLAYER_CONSTANTS.EXPLOSION_HEIGHT / 2 * scale);
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

                    if (++frameCount > PLAYER_CONSTANTS.DEATH_ANIMATION_FRAMES_COUNT - 1) {
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
                explosionAnimation.setX(targetX - PLAYER_CONSTANTS.EXPLOSION_WIDTH / 2 * scale);
                explosionAnimation.setY(targetY - PLAYER_CONSTANTS.EXPLOSION_HEIGHT / 2 * scale);
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

                    if (++frameCount > PLAYER_CONSTANTS.DEATH_ANIMATION_FRAMES_COUNT - 1) {
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

            function loadDisappearanceAnimation() {
                var disappearanceObj = new Image();
                disappearanceObj.onload = function() {
                    disappearanceAnimation = new Kinetic.Sprite({
                        x: 0,
                        y: 0,
                        image: disappearanceObj,
                        scale: {
                            x: 0,
                            y: 0
                        },

                        animation: 'disappearance',
                        animations: {
                            disappearance: [
                                0, 512, 128, 128,
                                0, 384, 128, 128,
                                0, 256, 128, 128,
                                0, 128, 128, 128,
                                0, 0, 128, 128
                            ]
                        },

                        frameRate: 20
                    });

                    ammoLayer.add(disappearanceAnimation);
                    disappearanceAnimation.hide();
                };

                disappearanceObj.src = 'assets/images/poof.png';
            }

            function runDisappearanceAnimation(targetX, targetY, scale, frameRate) {
                disappearanceAnimation.stop();
                var frameCount = 0;
                disappearanceAnimation.setAnimation('disappearance');
                disappearanceAnimation.setX(targetX - PLAYER_CONSTANTS.SMOKE_ANIMATION_WIDTH / 2 * scale);
                disappearanceAnimation.setY(targetY - PLAYER_CONSTANTS.SMOKE_ANIMATION_HEIGHT / 2 * scale);
                disappearanceAnimation.setScale({
                    x: scale,
                    y: scale
                });
                disappearanceAnimation.setFrameRate(frameRate);

                disappearanceAnimation.show();
                disappearanceAnimation.on('frameIndexChange', function(e) {
                    if (++frameCount > 4) {
                        disappearanceAnimation.stop();
                        disappearanceAnimation.hide();
                        frameCount = 0;
                    }
                });
                disappearanceAnimation.start();
            }

            function getRandomCoordinate(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function initialize() {
                loadSounds();
                loadCanvas();
                loadBackground();
                loadPlayer();
                addEventListeners();
                loadExplosionAnimation();
                loadDisappearanceAnimation();
            }

            function run() {
                var gameLoopControl = setTimeout(function() {
                    var gameLoop = requestAnimationFrame(run);

                    // Check if not dead
                    player.isDead = player.health <= 0;

                    if (player.isDead) {
                        removeEventListeners();
                        cancelAnimationFrame(gameLoop);
                        clearTimeout(gameLoopControl);
                        playerLayer.clear();
                        player.kineticImage.remove();
                        runDeathAnimation(player.kineticImage.getX() + PLAYER_CONSTANTS.WIDTH / 2,
                            player.kineticImage.getY() + PLAYER_CONSTANTS.HEIGHT / 2, PLAYER_CONSTANTS.EXPLOSION_SCALE, PLAYER_CONSTANTS.EXPLOSION_FRAME_RATE);

                        // Delay the endscreen show-up
                        setTimeout(function() {
                            stage.remove(enemiesLayer);
                            //window.location.href = '../termination/termination.html';
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

                        var playerEnemyCollision = checkIfPlayerCollidedWithEnemy(player, enemies[i].enemy);
                        if (playerEnemyCollision) {
                            player.health -= 100;
                            removeEnemy(i);
                        }
                    }

                    // The right way to set z indices
                    backgroundLayer.moveToTop();
                    ammoLayer.moveToTop();
                    playerLayer.moveToTop();
                    enemiesLayer.moveToTop();

                    // Draw only the layer that needs update
                    enemiesLayer.draw();

                    // Improvised dying
                    //if (currentFrame % 40 === 0 && playerWasHit) {
                    //    logHealth(100, player);
                    //}

                    //Last step is to update the frame counter
                    currentFrame += 1;

                }, 30);
            }

            (function() {
                initialize();
                run();
            }());

            function createBullet(gunBarrelX, gunBarrelY) {
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

                bulletImageObject.onload = function() {
                    ammoLayer.add(bulletKineticImage); // ammoLayer has now length of 1
                    stage.add(ammoLayer);
                };

                bulletImageObject.src = 'assets/images/bullet.png';

                return bulletKineticImage;
            }

            function shootBullet(gunBarrelX, gunBarrelY, bulletDestinationX, bulletDestinationY) {
                var bullet = createBullet(gunBarrelX, gunBarrelY);
                ammoLayer.add(bullet);

                var targetX = bulletDestinationX - bullet.getX(),
                    targetY = bulletDestinationY - bullet.getY(),
                    distance = Math.sqrt(targetX * targetX + targetY * targetY);

                var velocityX = (targetX / distance) * player.attackSpeed,
                    velocityY = (targetY / distance) * player.attackSpeed;

                var bulletShotAnimation = new Kinetic.Animation(function(frame) {
                    bullet.setX(bullet.getX() + velocityX);
                    bullet.setY(bullet.getY() + velocityY);

                    var deadEnemyIndex = getDeadEnemyIndex(bullet),
                        bulletHasLeftField = bulletLeftField(bullet);

                    if (deadEnemyIndex) {
                        // Remove dead bullet and dead enemy
                        bullet.destroy();
                        removeEnemy(deadEnemyIndex);

                        // Lifesteal ability
                        if (player.health < 1000) {
                            player.health += 15;
                            logHealth(-15, player.health);
                        }

                        // Update score count
                        score += 1;

                        $("#scoreSpan").text(score);

                        var name = sessionStorage.getItem('heroName')
                        var highestScore = 0;
                        sessionStorage.playerScore = Number(sessionStorage.playerScore) + 1;
                        highestScore = sessionStorage.playerScore;
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

            function getDeadEnemyIndex(bullet) {
                for (var i in enemies) {
                    if (enemies.hasOwnProperty(i)) {
                        var enemyCenterX = enemies[i].enemy.getX() + ENEMY_CONSTANTS.SCALE * ENEMY_CONSTANTS.WIDTH / 2,
                            enemyCenterY = enemies[i].enemy.getY() + ENEMY_CONSTANTS.SCALE * ENEMY_CONSTANTS.HEIGHT / 2,
                            bulletCenterX = bullet.getX() + PLAYER_CONSTANTS.BULLET_RADIUS,
                            bulletCenterY = bullet.getY() + PLAYER_CONSTANTS.BULLET_RADIUS;

                        if ((enemyCenterX - bulletCenterX) * (enemyCenterX - bulletCenterX) +
                            (enemyCenterY - bulletCenterY) * (enemyCenterY - bulletCenterY) <=
                            (ENEMY_CONSTANTS.RADIUS + PLAYER_CONSTANTS.BULLET_RADIUS) * (ENEMY_CONSTANTS.RADIUS + PLAYER_CONSTANTS.BULLET_RADIUS)) {

                            return i;
                        }
                    }
                }
                return null;
            }

            function removeEnemy(position) {
                enemies[position].enemy.destroy();
                enemies.splice(position, 1);
            }

            function bulletLeftField(bullet) {
                if (bullet.getX() < 0 - 30 ||
                    bullet.getX() > GLOBAL_CONSTANTS.STAGE_WIDTH + 30 ||
                    bullet.getY() < 0 - 30 ||
                    bullet.getY() > GLOBAL_CONSTANTS.STAGE_HEIGHT + 30) {
                    return true;
                }

                return false;
            }

            function checkIfPlayerCollidedWithEnemy(player, enemy) {
                var playerCollidedWithEnemy = false;

                var deadlyRadius = 50;
                playerCenterX = player.kineticImage.getX() + PLAYER_CONSTANTS.WIDTH / 2;
                playerCenterY = player.kineticImage.getY() + PLAYER_CONSTANTS.HEIGHT / 2;

                var enemyLeftX = enemy.getX(),
                    enemyRigthX = enemy.getX() + ENEMY_CONSTANTS.WIDTH,
                    enemyY = enemy.getY();

                if (enemyLeftX <= playerCenterX && playerCenterX <= enemyRigthX && Math.abs(enemyY - playerCenterY) <= deadlyRadius) {
                    playerCollidedWithEnemy = true;
                }

                if ((enemyLeftX - playerCenterX) * (enemyLeftX - playerCenterX) + (enemyY - playerCenterY) * (enemyY - playerCenterY) <= deadlyRadius ||
                    (enemyRigthX - playerCenterX) * (enemyRigthX - playerCenterX) + (enemyY - playerCenterY) * (enemyY - playerCenterY) <= deadlyRadius) {
                    playerCollidedWithEnemy = true;
                }

                return playerCollidedWithEnemy;
            }
        }
    );