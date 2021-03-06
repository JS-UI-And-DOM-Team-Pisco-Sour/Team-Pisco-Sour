define(function() {
    return {
        WIDTH: 155,
        HEIGHT: 160,
        DEATH_ANIMATION_FRAMES_COUNT: 49,
        SMOKE_ANIMATION_FRAMES_COUNT: 40,
        SMOKE_ANIMATION_WIDTH: 128,
        SMOKE_ANIMATION_HEIGHT: 128,
        INITIAL_HEALTH: 1000,
        ATTACK_SPEED: 20,

        FACING_DIRECTIONS: {
            UP: 2,
            DOWN: 6,

            LEFT: 0,
            RIGHT: 4,

            UP_LEFT: 7,
            UP_RIGHT: 5,

            DOWN_LEFT: 1,
            DOWN_RIGHT: 3,

            DEFAULT: 3
        },

        EXPLOSION_WIDTH: 256,
        EXPLOSION_HEIGHT: 256,
        EXPLOSION_SCALE: 2.6,
        EXPLOSION_FRAME_RATE: 30,

        BULLET_WIDTH: 28,
        BULLET_HEIGHT: 28,
        BULLET_RADIUS: 12,
        BULLET_SHOT_SCALE: 0.2,
        BULLET_SHOT_FRAMERATE: 10,
        SHIFT: 30,

        HEALTH_REDUCED_ON_ENEMY_COLLISION: 200,
        HEALTH_INCREASED_ON_ENEMY_HIT: 15
    }
});