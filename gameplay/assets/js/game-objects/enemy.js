define(['./contracts/character', '../constants'], function (Character, CONSTANTS) {
    var Enemy = (function (parent) {
        var Enemy = function (imagePath, frame) {
            parent.call(this, imagePath);
            this.speed = CONSTANTS.ENEMY_SPEED;
            this.frame = frame;
        };

        Enemy.prototype = parent.prototype;

        Enemy.prototype.attackPlayer = function (playerKineticImage) {
            playerCenterX = playerKineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2;
            playerCenterY = playerKineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2;

            var enemyX = this.getX(),
                enemyY = this.getY(),
                rotation = Math.atan2(playerCenterY - enemyY, playerCenterX - enemyX);

            this.setX(enemyX + Math.cos(rotation) * CONSTANTS.ENEMY_SPEED);
            this.setY(enemyY + Math.sin(rotation) * CONSTANTS.ENEMY_SPEED);
        };

        return Enemy;
    }(Character));

    return Enemy;
});