define(['../../../lib/jquery-1.11.3.min'], function() {
    var hBar = $('.health-bar'),
        bar = hBar.find('.bar'),
        hit = hBar.find('.hit'),
        damage = 0;

    function registerHealth(inflictedDamage, player) {
        var total = hBar.data('total'),
            value = hBar.data('value');
        player.health -= inflictedDamage;
        damage += inflictedDamage;

        var newValue = value - damage;
        var hitWidth = (damage / total) * 100 + "%";
        hit.css({
            'display': 'block',
            'width': hitWidth
        });
        hBar.data('value', newValue);
        log(damage, hitWidth, player.health);
    }

    function log(_damage, _hitWidth, _lifeLeft) {
        var log = $('.log');
        log.empty();
        if (typeof(_damage) !== 'undefined' && typeof(_hitWidth) !== 'undefined') {
            if (_lifeLeft >= 1000) {
                log.append("<p> (" + _lifeLeft + " / 1000)</p>");
            }
            else if (_lifeLeft <= 900 && _lifeLeft >= 100) {
                log.append("<p> (0" + _lifeLeft + " / 1000)</p>");
            }
            else if(_lifeLeft < 100 && _lifeLeft >= 10){
                log.append("<p> (00" + _lifeLeft + " / 1000)</p>");
            }
            else if(_lifeLeft < 10 && _lifeLeft> 0){
                log.append("<p> (000" + _lifeLeft + " / 1000)</p>");
            }
            else if(_lifeLeft <= 0) {
                log.append("<p> (0000 / 1000)</p>");
            }
        }
    }

    return registerHealth;
});