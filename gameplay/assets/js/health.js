define(['./constants'], function(CONSTANTS) {
    var hitBtn = $('button.damage'),
        hBar = $('.health-bar'),
        bar = hBar.find('.bar'),
        hit = hBar.find('.hit');
    var damage = 0;

    function registerHealth(inflictedDamage, player) {
        var total = hBar.data('total'),
            value = hBar.data('value');
        player.health -= inflictedDamage;
        damage += inflictedDamage;
        if (player.health >= 0) {
            var newValue = value - damage;
            var hitWidth = (damage / total) * 100 + "%";
            hit.css({
                'display': 'block',
                'width': hitWidth
            });
            hBar.data('value', newValue);
            log(damage, hitWidth, player.health);
        }
    }

    //hitBtn.on("click", onBtnClick);

    function log(_damage, _hitWidth, _decreasedLife) {
        var log = $('.log');
        log.empty();
        if (_damage !== undefined && _hitWidth !== undefined) {
            log.append("<div> (" + _decreasedLife + " / 1000)</div>");
        }
    }

    return registerHealth;
});
