(function () {
    var CONSTANTS = {
        SVG_WIDTH: 400,
        SVG_HEIGHT: 400,
        SVG_TOP_LEFT_X: 50,
        SVG_TOP_LEFT_Y: 50,

        OUTLINE_RADIUS: 20,
        OUTLINE_STROKE_WIDTH: 15,

        BEZIER_CIRCLE_CONST: 0.551915,
        LOOP_RADIUS: 170,
        MAX_NUMBER_OF_LOOPS: 100,
        LOOP_TIME: 10000,
        LOOP_OFFSET: 1000
    };

    var paper;

    function loadSVG() {
        var xmlns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(xmlns, 'svg');
        svg.setAttributeNS(null, 'id', 'svg_logo');
        svg.setAttributeNS(null, 'width', CONSTANTS.SVG_WIDTH);
        svg.setAttributeNS(null, 'height', CONSTANTS.SVG_HEIGHT);
        svg.setAttributeNS(null, 'position', 'absolute');
        svg.setAttributeNS(null, 'top', CONSTANTS.SVG_TOP_LEFT_Y);
        svg.setAttributeNS(null, 'left', CONSTANTS.SVG_TOP_LEFT_X);
        document.body.appendChild(svg);

        paper = Snap('#svg_logo');
    }

    function drawOutline() {
        paper.rect(CONSTANTS.OUTLINE_RADIUS / 2, CONSTANTS.OUTLINE_RADIUS / 2,
            CONSTANTS.SVG_WIDTH - CONSTANTS.OUTLINE_RADIUS, CONSTANTS.SVG_HEIGHT - CONSTANTS.OUTLINE_RADIUS,
            CONSTANTS.OUTLINE_RADIUS, CONSTANTS.OUTLINE_RADIUS)
            .attr({
                'stroke': '#123456',
                'strokeWidth': CONSTANTS.OUTLINE_STROKE_WIDTH,
                'fill': 'none',
                'opacity': 0.3
            });
    }

    function drawSpaceship() {
        // Legs
        paper.path('M38,36.013l-6,6l-4,4v6l-6,10l4,2l14-14L38,36.013z M28,26.013l-14-2l-14,14l2,4l10-6h6l4-4L28,26.013z')
            .attr({
                'fill': '#CCC'
            })
            .transform('t135,185s3,3');

        // Outer flames
        paper.path('M10,44.013c-3.939,5.748-9.974,12.835-10,16c-0.021,2.403,1.576,4.021,4,4 c3.217-0.027,10.011-6.031,16-10L10,44.013z')
            .attr({
                'fill': '#FC6'
            })
            .transform('t115,205s3,3');

        // Inner flames
        paper.path('M16,42.013c-3.939,5.748-12,12.835-12,16c0,2.091,0.201,2,2,2c3.217,0,10.011-8.031,16-12 L16,42.013z')
            .attr({
                'fill': '#ED7161'
            })
            .transform('t120,200s3,3');

        // Body below
        paper.path('M60,0.013c-6.286,0.389-17.138,1.137-30,14C20.539,23.474,12.239,37.231,8.348,46.36l9.367,9.367 ' +
            'C26.793,51.874,40.459,43.553,50,34.013c12.779-12.779,13.507-23.669,14-30C64.22,1.187,62.614-0.149,60,0.013z')
            .attr({
                'fill': '#387AA7'
            })
            .transform('t170,150s3,3');

        // Body above
        paper.path('M60,0.013c-6.286,0.389-17.138,1.137-30,14c-7.724,7.723-14.664,18.307-19.078,26.905 l12.235,' +
            '12.235C31.703,48.751,42.222,41.791,50,34.013c12.779-12.779,13.507-23.669,14-30C64.22,1.187,62.614-0.149,60,0.013z')
            .attr({
                'fill': '#48A0DC'
            })
            .transform('t172.5,147.5s3,3');

        // Outer glass
        paper.circle(48, 16.013, 8).attr({
            'fill': '#4D4D4D'
        }).transform('t192,128s3,3');

        // Inner glass
        paper.circle(48, 16.013, 4).attr({
            'fill': '#FFFFFF'
        }).transform('t192,128s3,3');
    }

    function drawTeamName() {
        var teamName = 'TEAM PISCO SOUR';
        var controlPointParameter = Math.floor(CONSTANTS.BEZIER_CIRCLE_CONST * CONSTANTS.LOOP_RADIUS);
        var path = 'M0 ' + CONSTANTS.LOOP_RADIUS +
            Array.apply(null, new Array(CONSTANTS.MAX_NUMBER_OF_LOOPS))
                .map(function () {
                    return 'C' + controlPointParameter + ' ' + CONSTANTS.LOOP_RADIUS + ' ' + CONSTANTS.LOOP_RADIUS + ' ' +
                        controlPointParameter + ' ' + CONSTANTS.LOOP_RADIUS + ' 0 C' + CONSTANTS.LOOP_RADIUS + ' -' +
                        controlPointParameter + ' ' + controlPointParameter + ' -' + CONSTANTS.LOOP_RADIUS + ' 0 -' +
                        CONSTANTS.LOOP_RADIUS + ' C -' + controlPointParameter + ' -' + CONSTANTS.LOOP_RADIUS + ' -' +
                        CONSTANTS.LOOP_RADIUS + ' -' + controlPointParameter + ' -' + CONSTANTS.LOOP_RADIUS + ' 0 C -' +
                        CONSTANTS.LOOP_RADIUS + ' ' + controlPointParameter + ' -' + controlPointParameter + ' ' +
                        CONSTANTS.LOOP_RADIUS + ' 0 ' + CONSTANTS.LOOP_RADIUS + ' ';
                })
                .join('');

        var animatedText = paper.text(0, 0, teamName)
            .attr({
                'textpath': path
            })
            .transform('t200,200');

        animatedText.textPath.animate({
            'startOffset': CONSTANTS.LOOP_OFFSET * CONSTANTS.MAX_NUMBER_OF_LOOPS
            },

            CONSTANTS.LOOP_TIME * CONSTANTS.MAX_NUMBER_OF_LOOPS, mina.linear);

    }

    (function () {
        loadSVG();
        drawOutline();
        drawSpaceship();
        drawTeamName();
    }())
}());