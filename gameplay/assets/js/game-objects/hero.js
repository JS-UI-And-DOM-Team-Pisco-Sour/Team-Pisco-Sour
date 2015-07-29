define(['./contracts/character', 'globalConstants', 'playerConstants'],
    function (Character, GLOBAL_CONSTANTS, PLAYER_CONSTANTS) {
        var Hero = (function (parent) {
            function isPlayerOutOfBorders(x, y) {
                var isOutOfBorderX = x <= 40 || x >= (GLOBAL_CONSTANTS.STAGE_WIDTH - 50),
                    isOutOfBorderY = y <= 50 || y >= (GLOBAL_CONSTANTS.STAGE_HEIGHT - 40);

                return {
                    x: isOutOfBorderX,
                    y: isOutOfBorderY
                };
            }

            var Hero = function (imagePath, health, layer, attackSpeed) {
                parent.call(this, imagePath);
                this.health = health;
                this.isDead = false;
                this.smallTeleportationAmount = 150;
                this.averageTeleportationAmount = 300;
                this.largeTeleportationAmount = 450;
                this.facingDirection = PLAYER_CONSTANTS.FACING_DIRECTIONS.DEFAULT;
                this.layer = layer;
                this.attackSpeed = attackSpeed;
            };

            Hero.prototype = parent.prototype;

            Hero.prototype.checkDirectionAndTeleport = function (amount) {
                var playerCenterX = this.kineticImage.getX() + PLAYER_CONSTANTS.WIDTH / 2;
                var playerCenterY = this.kineticImage.getY() + PLAYER_CONSTANTS.HEIGHT / 2;

                var nextMove = this.getDisplacement(amount),
                    newPlayerX = playerCenterX + nextMove.x,
                    newPlayerY = playerCenterY + nextMove.y,

                    bordersVerdict = isPlayerOutOfBorders(newPlayerX, newPlayerY);

                if (!bordersVerdict.x) {
                    this.kineticImage.setX(newPlayerX - PLAYER_CONSTANTS.WIDTH / 2);
                }

                if (!bordersVerdict.y) {
                    this.kineticImage.setY(newPlayerY - PLAYER_CONSTANTS.HEIGHT / 2);
                }

                this.layer.draw();
            };

            Hero.prototype.getDisplacement = function (amount) {
                switch (this.facingDirection) {
                    case PLAYER_CONSTANTS.FACING_DIRECTIONS.UP:
                    {
                        return {
                            x: 0,
                            y: +amount
                        }
                    }
                    case PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN:
                    {
                        return {
                            x: 0,
                            y: -amount
                        }
                    }
                    case PLAYER_CONSTANTS.FACING_DIRECTIONS.LEFT:
                    {
                        return {
                            x: -amount,
                            y: 0
                        }
                    }
                    case PLAYER_CONSTANTS.FACING_DIRECTIONS.RIGHT:
                    {
                        return {
                            x: +amount,
                            y: 0
                        }
                    }
                    case PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_LEFT:
                    {
                        return {
                            x: -amount * Math.cos(45 / 180 * Math.PI),
                            y: -amount * Math.sin(45 / 180 * Math.PI)
                        }
                    }
                    case PLAYER_CONSTANTS.FACING_DIRECTIONS.UP_RIGHT:
                    {
                        return {
                            x: +amount * Math.cos(45 / 180 * Math.PI),
                            y: -amount * Math.sin(45 / 180 * Math.PI)
                        }
                    }
                    case PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_LEFT:
                    {
                        return {
                            x: -amount * Math.cos(45 / 180 * Math.PI),
                            y: +amount * Math.sin(45 / 180 * Math.PI)
                        }
                    }
                    case PLAYER_CONSTANTS.FACING_DIRECTIONS.DOWN_RIGHT:
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