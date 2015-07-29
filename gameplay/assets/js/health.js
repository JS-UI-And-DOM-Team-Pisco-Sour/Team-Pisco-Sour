define(['jquery'], function() {
    var hBar = $('.health-bar'),
        bar = hBar.find('.bar'),
        hit = hBar.find('.hit'),
        damage = 0;

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

    function log(_damage, _hitWidth, _decreasedLife) {
        var log = $('.log');
        log.empty();
        if (_damage !== undefined && _hitWidth !== undefined) {
            if (_decreasedLife === 1000) {
                log.append("<p> (" + _decreasedLife + " / 1000)</p>");
            }
            if (_decreasedLife <= 900 && _decreasedLife >= 100) {
                log.append("<p> (0" + _decreasedLife + " / 1000)</p>");
            }
            if(_decreasedLife === 0){
            log.append("<p> (000" + _decreasedLife + " / 1000)</p>");
        }
        }
    }

    return registerHealth;
});