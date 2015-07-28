define(['./contracts/character', '../constants'], function (Character, CONSTANTS) {
    var Hero = (function (parent) {
        function isPlayerOutOfBorders(x, y) {
            var isOutOfBorderX = x <= 40 || x >= (CONSTANTS.STAGE_WIDTH - 50),
                isOutOfBorderY = y <= 50 || y >= (CONSTANTS.STAGE_HEIGHT - 40);

            return {
                x: isOutOfBorderX,
                y: isOutOfBorderY
            };
        }

        var Hero = function(imagePath, health, layer, attackSpeed) {
            parent.call(this, imagePath);
            this.health = health;
            this.isDead = false;
            this.smallTeleportationAmount = 150;
            this.averageTeleportationAmount = 300;
            this.largeTeleportationAmount = 450;
            this.facingDirection = CONSTANTS.FACING_DIRECTIONS.DEFAULT;
            this.layer = layer;
            this.attackSpeed = attackSpeed;
        };

        Hero.prototype = parent.prototype;

        Hero.prototype.checkDirectionAndTeleport = function (amount) {
            var playerCenterX = this.kineticImage.getX() + CONSTANTS.PLAYER_WIDTH / 2;
            var playerCenterY = this.kineticImage.getY() + CONSTANTS.PLAYER_HEIGHT / 2;

            var nextMove = this.getDisplacement(amount),
                newPlayerX = playerCenterX + nextMove.x,
                newPlayerY = playerCenterY + nextMove.y,

                bordersVerdict = isPlayerOutOfBorders(newPlayerX, newPlayerY);

            if (!bordersVerdict.x) {
                this.kineticImage.setX(newPlayerX - CONSTANTS.PLAYER_WIDTH / 2);
            }

            if (!bordersVerdict.y) {
                this.kineticImage.setY(newPlayerY - CONSTANTS.PLAYER_HEIGHT / 2);
            }

            this.layer.draw();
        };

        Hero.prototype.getDisplacement = function (amount) {
            switch (this.facingDirection) {
                case CONSTANTS.FACING_DIRECTIONS.UP:
                {
                    return {
                        x: 0,
                        y: +amount
                    }
                }
                case CONSTANTS.FACING_DIRECTIONS.DOWN:
                {
                    return {
                        x: 0,
                        y: -amount
                    }
                }
                case CONSTANTS.FACING_DIRECTIONS.LEFT:
                {
                    return {
                        x: -amount,
                        y: 0
                    }
                }
                case CONSTANTS.FACING_DIRECTIONS.RIGHT:
                {
                    return {
                        x: +amount,
                        y: 0
                    }
                }
                case CONSTANTS.FACING_DIRECTIONS.UP_LEFT:
                {
                    return {
                        x: -amount * Math.cos(45 / 180 * Math.PI),
                        y: -amount * Math.sin(45 / 180 * Math.PI)
                    }
                }
                case CONSTANTS.FACING_DIRECTIONS.UP_RIGHT:
                {
                    return {
                        x: +amount * Math.cos(45 / 180 * Math.PI),
                        y: -amount * Math.sin(45 / 180 * Math.PI)
                    }
                }
                case CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT:
                {
                    return {
                        x: -amount * Math.cos(45 / 180 * Math.PI),
                        y: +amount * Math.sin(45 / 180 * Math.PI)
                    }
                }
                case CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT:
                {
                    return {
                        x: +amount * Math.cos(45 / 180 * Math.PI),
                        y: +amount * Math.sin(45 / 180 * Math.PI)
                    }
                }
            }
        };

        return Hero;
    }(Character));

    return Hero;
});