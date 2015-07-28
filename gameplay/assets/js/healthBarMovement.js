$(document).ready(function() {
    var hitBtn = $('button.damage'),
        hBar = $('.health-bar'),
        bar = hBar.find('.bar'),
        hit = hBar.find('.hit');
    var damage = 0;
    health = 1000;

    hitBtn.on("click", function() {
        var total = hBar.data('total'),
            value = hBar.data('value');

        health -= 100;
        damage += 100;
        if (health >= 0) {
            var newValue = value - damage;
            // calculate the percentage of the total width
            var hitWidth = (damage / total) * 100 + "%";
            //var barWidth = (newValue / total) * 100 + "%";

            // show hit bar and set the width
            hit.css({
                'display': 'block',
                'width': hitWidth
            });
            hBar.data('value', newValue);
            log(damage, hitWidth, health);
        }
    });
});

function log(_damage, _hitWidth, _decreasedLife) {
    var log = $('.log');
    log.empty();
    if (_damage !== undefined && _hitWidth !== undefined) {
        log.append("<div> ( " + _decreasedLife + " / 1000 )</div>");
    }
}
