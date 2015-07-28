define(function () {
    return {
        STAGE_WIDTH: 0.7 * window.innerWidth,
        STAGE_HEIGHT: 0.9 * window.innerHeight,

        SCALE_HEIGHT: (1 / 6),
        SCALE_WIDTH: (1 / 4.5),

        PLAYER_WIDTH: 155,
        PLAYER_HEIGHT: 160,
        PLAYER_DEATH_ANIMATION_FRAMES_COUNT: 48,

        FACING_DIRECTIONS: {
            UP: 2,
            DOWN: 6,

            LEFT: 0,
            RIGHT: 4,

            UP_LEFT: 7,
            UP_RIGHT: 5,

            DOWN_LEFT: 1,
            DOWN_RIGHT: 3
        },

        KEYS: {
            A: 65,
            E: 69,
            Q: 81,
            W: 87
        },

        ENEMY_WIDTH: 99.2,
        ENEMY_HEIGHT: 111,
        ENEMY_FRAME_COUNT: 10,
        ENEMY_SPAWN_FRAME_INTERVAL: 60,
        ENEMY_SPEED: 2,

        EXPLOSION_WIDTH: 256,
        EXPLOSION_HEIGHT: 256,
        EXPLOSION_SCALE: 2.6,
        EXPLOSION_FRAME_RATE: 30,

        BULLET_SHOT_SCALE: 0.2,
        BULLET_SHOT_FRAMERATE: 10000000,
        SHIFT: 30
    }
});