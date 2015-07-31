define(['../common/global-constants', '../common/player-constants', '../common/enemy-constants'],
    function (GLOBAL_CONSTANTS, PLAYER_CONSTANTS, ENEMY_CONSTANTS) {
        function bulletLeftField(bullet) {
            if (bullet.getX() < 0 - 30 ||
                bullet.getX() > GLOBAL_CONSTANTS.STAGE_WIDTH + 30 ||
                bullet.getY() < 0 - 30 ||
                bullet.getY() > GLOBAL_CONSTANTS.STAGE_HEIGHT + 30) {
                return true;
            }

            return false;
        }

        function getDeadEnemyIndex(enemies, bullet) {
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

        function removeEnemy(enemies, position) {
            enemies[position].enemy.destroy();
            enemies.splice(position, 1);
        }

        function checkIfPlayerCollidedWithEnemy(player, enemy) {
            var playerCollidedWithEnemy = false;

            var deadlyRadius = 50;
            var playerCenterX = player.kineticImage.getX() + PLAYER_CONSTANTS.WIDTH / 2;
            var playerCenterY = player.kineticImage.getY() + PLAYER_CONSTANTS.HEIGHT / 2;

            var enemyLeftX = enemy.getX(),
                enemyRightX = enemy.getX() + ENEMY_CONSTANTS.WIDTH,
                enemyTopY = enemy.getY(),
                enemyBottomY = enemy.getY() + ENEMY_CONSTANTS.HEIGHT;

            var playerCenterXBetweenEnemyLeftXAndRightX = enemyLeftX <= playerCenterX && playerCenterX <= enemyRightX;

            var enemyTopSideInDeadlyRadius = playerCenterXBetweenEnemyLeftXAndRightX && Math.abs(enemyTopY - playerCenterY) <= deadlyRadius,
                enemyBottomSideInDeadlyRadius = playerCenterXBetweenEnemyLeftXAndRightX && Math.abs(enemyBottomY - playerCenterY) <= deadlyRadius;

            var enemyLeftTopInDeadlyRadius = (enemyLeftX - playerCenterX) * (enemyLeftX - playerCenterX) + (enemyTopY - playerCenterY) * (enemyTopY - playerCenterY) <= deadlyRadius,
                enemyRightTopInDeadlyRadius = (enemyRightX - playerCenterX) * (enemyRightX - playerCenterX) + (enemyTopY - playerCenterY) * (enemyTopY - playerCenterY) <= deadlyRadius,
                enemyLeftBottomInDeadlyRadius = (enemyLeftX - playerCenterX) * (enemyLeftX - playerCenterX) + (enemyBottomY - playerCenterY) * (enemyBottomY - playerCenterY) <= deadlyRadius,
                enemyRightBottomInDeadlyRadius = (enemyRightX - playerCenterX) * (enemyRightX - playerCenterX) + (enemyBottomY - playerCenterY) * (enemyBottomY - playerCenterY) <= deadlyRadius;

            var enemyTopXInDeadlyRadius = enemyLeftTopInDeadlyRadius || enemyRightTopInDeadlyRadius,
                enemyBottomXInDeadlyRadius = enemyLeftBottomInDeadlyRadius || enemyRightBottomInDeadlyRadius;

            if (enemyTopSideInDeadlyRadius || enemyBottomSideInDeadlyRadius) {
                playerCollidedWithEnemy = true;
            }

            if (enemyTopXInDeadlyRadius || enemyBottomXInDeadlyRadius) {
                playerCollidedWithEnemy = true;
            }

            return playerCollidedWithEnemy;
        }

        function runExplosionAt(x, y, scale, frameRate, layer) {
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

        function runPoofAt(x, y, scale, layer) {
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
                }
                var mariika = requestAnimationFrame(run);
            }());
        }

        return {
            bulletLeftField: bulletLeftField,
            getDeadEnemyIndex: getDeadEnemyIndex,
            removeEnemy: removeEnemy,
            checkIfPlayerCollidedWithEnemy: checkIfPlayerCollidedWithEnemy,
            runExplosionAt: runExplosionAt,
            runPoofAt: runPoofAt
        }
    });