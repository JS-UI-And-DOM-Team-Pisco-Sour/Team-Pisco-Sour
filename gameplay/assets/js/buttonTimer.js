define(['buttonTimer'], function () {
    var qBtn = $('#qButton'),
        wBtn = $('#wButton'),
        eBtn = $('#eButton'),
        aBtn = $("#aButton"),
        qTimer = $("#qTimer"),
        wTimer = $("#wTimer"),
        eTimer = $("#eTimer"),
        aTimer = $("#aTimer"),
        activeButtons = [true, true, true, true];

    $(document).bind('keypress', function (key) {
        var keycode = key.charCode || key.keyCode || key.which;

        alert('KeyCode' + keycode);
        if (keycode === 101) {
            (function () {
                var counter = 3;
                setInterval(function () {
                    counter--;
                    if (counter > 0) {
                        activeButtons[0] = false;
                        qTimer.empty();
                        key.preventDefault();
                        qTimer.append("<p>'Q' Delay: " + (counter) + " s</p>");
                        qBtn.css({
                            'opacity': '0.5'
                        });
                    }
                    if (counter === 0) {
                        qTimer.empty();
                        clearInterval(counter);
                        qBtn.css({
                            'opacity': '1'
                        });
                        qTimer.append("<p>Ready to use</p>");
                        activeButtons[0] = true;
                    }
                }, 1000);
            })();
        }
        if (keycode === 119) {
            (function () {
                var counter = 3;
                setInterval(function () {
                    counter--;
                    if (counter > 0) {
                        activeButtons[1] = false;
                        wTimer.empty();
                        key.preventDefault();
                        wTimer.append("<p>'W' Delay: " + (counter) + " s</p>");
                        wBtn.css({
                            'opacity': '0.5'
                        });
                    }
                    if (counter === 0) {
                        wTimer.empty();
                        clearInterval(counter);
                        wBtn.css({
                            'opacity': '1'
                        });
                        wTimer.append("<p>Ready to use</p>");
                        activeButtons[1] = false;
                    }
                }, 1000);
            })();
        }
        if (keycode === 113) {
            (function () {
                var counter = 3;
                setInterval(function () {
                    counter--;
                    if (counter > 0) {
                        activeButtons[2] = false;
                        eTimer.empty();
                        key.preventDefault();
                        eTimer.append("<p>'E' Delay: " + (counter) + " s</p>");
                        eBtn.css({
                            'opacity': '0.5'
                        });
                    }
                    if (counter === 0) {
                        eTimer.empty();
                        clearInterval(counter);
                        eBtn.css({
                            'opacity': '1'
                        });
                        eTimer.append("<p>Ready to use</p>");
                        activeButtons[2] = true;
                    }
                }, 1000);
            })();
        }
        if (keycode === 97) {
            (function () {
                var counter = 3;
                setInterval(function () {
                    counter--;
                    if (counter > 0) {
                        activeButtons[3] = false;
                        aTimer.empty();
                        key.preventDefault();
                        aTimer.append("<p>Delay: " + (counter) + " s</p>");
                        aBtn.css({
                            'opacity': '0.5'
                        });
                    }
                    if (counter === 0) {
                        clearInterval(counter);
                        aBtn.css({
                            'opacity': '1'
                        });
                        aTimer.append("<p>Ready to use</p>");
                        activeButtons[3] = true;
                    }
                }, 1000);
            })();
        }
    });

    return activeButtons;
});