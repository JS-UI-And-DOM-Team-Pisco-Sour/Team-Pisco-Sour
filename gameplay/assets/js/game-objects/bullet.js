define(['./contracts/game-object', '../common/global-constants', '../common/player-constants', '../helpers/game-state-helper', '../health'],
    function (GameObject, GLOBAL_CONSTANTS, PLAYER_CONSTANTS, gameStateHelper, logHealth) {
        var Bullet = (function (parent) {
            var Bullet = function (x, y, imagePath) {
                parent.call(this, imagePath);
                this.kineticImage = new Kinetic.Image({
                    x: x,
                    y: y,
                    image: this.image,
                    width: 28,
                    height: 28,
                    crop: {
                        x: 0,
                        y: 0,
                        width: 128,
                        height: 128
                    }
                });
            };

            Bullet.prototype.shoot = function (bulletDestinationX, bulletDestinationY, enemies, player, stage, ammoLayer, layer) {
                var that = this;
                var targetX = bulletDestinationX - that.kineticImage.getX(),
                    targetY = bulletDestinationY - that.kineticImage.getY(),
                    distance = Math.sqrt(targetX * targetX + targetY * targetY);

                var velocityX = (targetX / distance) * player.attackSpeed,
                    velocityY = (targetY / distance) * player.attackSpeed;
                var bulletShotAnimation = new Kinetic.Animation(function () {
                    that.kineticImage.setX(that.kineticImage.getX() + velocityX);
                    that.kineticImage.setY(that.kineticImage.getY() + velocityY);

                    var deadEnemyIndex = gameStateHelper.getDeadEnemyIndex(enemies, that.kineticImage),
                        bulletHasLeftField = gameStateHelper.bulletLeftField(that.kineticImage);

                    if (deadEnemyIndex) {
                        // The three magic rows that save the whole of the universe. Amin.
                        that.kineticImage.setX(GLOBAL_CONSTANTS.STAGE_WIDTH * 2);
                        that.kineticImage.setY(GLOBAL_CONSTANTS.STAGE_HEIGHT * 2);
                        that.kineticImage.destroy();

                        gameStateHelper.runExplosionAt(enemies[deadEnemyIndex].enemy.getX(), enemies[deadEnemyIndex].enemy.getY(), 0.6, 5, layer);
                        gameStateHelper.removeEnemy(enemies, deadEnemyIndex);

                        // Lifesteal ability
                        if (player.health < 1000) {
                            // Using '-' sign, so that the damage is inverted and the value is actually added to the player's health points
                            logHealth(-PLAYER_CONSTANTS.HEALTH_INCREASED_ON_ENEMY_HIT, player);
                        }

                        // Update score count
                        player.score += 1;
                    }

                    if (bulletHasLeftField) {
                        that.kineticImage.destroy();
                    }
                }, ammoLayer);

                ammoLayer.add(that.kineticImage);
                stage.add(ammoLayer);
                bulletShotAnimation.start();
            };

            return Bullet;
        }(GameObject));

        return Bullet;
    });