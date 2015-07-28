define(['./contracts/character', '../constants'], function (character, CONSTANTS) {
    function isPlayerOutOfBorders(x, y) {
        var isOutOfBorderX = x <= 40 || x >= (CONSTANTS.STAGE_WIDTH - 50),
            isOutOfBorderY = y <= 50 || y >= (CONSTANTS.STAGE_HEIGHT - 40);

        return {
            x: isOutOfBorderX,
            y: isOutOfBorderY
        };
    }

    var hero = Object.create(character);
    Object.defineProperties(hero, {
        init: {
            value: function (imagePath, health, layer) {
                character.init.call(this, imagePath);
                this.health = health;
                this.isDead = false;
                this.smallTeleportationAmount = 100;
                this.averageTeleportationAmount = 200;
                this.largeTeleportationAmount = 300;
                this.facingDirection = CONSTANTS.FACING_DIRECTIONS.DEFAULT;
                this.layer = layer;

                return this;
            }
        },

        checkDirectionAndTeleport: {
            value: function (amount) {
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
            }
        },

        getDisplacement: {
            value: function (amount) {
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
            }
        }
    });

    return hero;
})
;