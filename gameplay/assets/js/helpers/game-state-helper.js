define(['globalConstants', 'playerConstants', 'enemyConstants'], function (GLOBAL_CONSTANTS, PLAYER_CONSTANTS, ENEMY_CONSTANTS) {
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

    return {
        bulletLeftField: bulletLeftField,
        getDeadEnemyIndex: getDeadEnemyIndex,
        removeEnemy: removeEnemy,
        checkIfPlayerCollidedWithEnemy: checkIfPlayerCollidedWithEnemy
    }
});