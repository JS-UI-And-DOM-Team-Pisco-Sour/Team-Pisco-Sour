define(['jquery'], function () {
    var qBtn = $('#qButton'),
        wBtn = $('#wButton'),
        eBtn = $('#eButton'),
        timer = $("#timer");

    $(document).bind('keypress', function (key) {
        var keycode = key.charCode || key.keyCode || key.which;

        if (keycode === 113) {
            (function () {
                var counter = 5;

                setInterval(function () {
                    counter--;
                    timer.empty();
                    if (counter > 0) {
                        key.preventDefault();
                        timer.append("<p>Delay time:<br />" + (counter) + " s</p>");
                        qBtn.css({
                            'opacity': '0.5'
                        });
                    }
                    if (counter === 0) {
                        clearInterval(counter);
                        qBtn.css({
                            'opacity': '1'
                        });
                    }
                }, 1000);
            })();
        }
        if (keycode === 119) {
            (function () {
                var counter = 5;

                setInterval(function () {
                    counter--;
                    timer.empty();
                    if (counter > 0) {
                        key.preventDefault();
                        timer.append("<p>Delay time:<br />" + (counter) + " s</p>");
                        wBtn.css({
                            'opacity': '0.5'
                        });
                    }
                    if (counter === 0) {
                        clearInterval(counter);
                        wBtn.css({
                            'opacity': '1'
                        });
                    }
                }, 1000);
            })();
        }
        if (keycode === 101) {
            (function () {
                var counter = 5;

                setInterval(function () {
                    counter--;
                    timer.empty();
                    if (counter > 0) {
                        key.preventDefault();
                        timer.append("<p>Delay time:<br />" + (counter) + " s</p>");
                        eBtn.css({
                            'opacity': '0.5'
                        });
                    }
                    if (counter === 0) {
                        clearInterval(counter);
                        eBtn.css({
                            'opacity': '1'
                        });
                    }
                }, 1000);
            })();
        }
    });
});