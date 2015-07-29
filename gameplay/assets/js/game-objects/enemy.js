define(['./contracts/character', 'playerConstants', 'enemyConstants'],
    function (Character, PLAYER_CONSTANTS, ENEMY_CONSTANTS) {
        var Enemy = (function (parent) {
            var Enemy = function (imagePath, frame) {
                parent.call(this, imagePath);
                this.speed = ENEMY_CONSTANTS.SPEED;
                this.frame = frame;
            };

            Enemy.prototype = parent.prototype;

            Enemy.prototype.attackPlayer = function (playerKineticImage) {
                playerCenterX = playerKineticImage.getX() + PLAYER_CONSTANTS.WIDTH / 2;
                playerCenterY = playerKineticImage.getY() + PLAYER_CONSTANTS.HEIGHT / 2;

                var enemyX = this.getX(),
                    enemyY = this.getY(),
                    rotation = Math.atan2(playerCenterY - enemyY, playerCenterX - enemyX);

                this.setX(enemyX + Math.cos(rotation) * ENEMY_CONSTANTS.SPEED);
                this.setY(enemyY + Math.sin(rotation) * ENEMY_CONSTANTS.SPEED);
            };

            return Enemy;
        }(Character));

        return Enemy;
    });