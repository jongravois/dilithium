(function (window) {
    "use strict";

    var setCookie = function (name, value, expiresDays, path, domain, secure) {

        if (expiresDays) {
            var date = new Date();
            date.setTime(date.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
            var expires = date.toGMTString();
        }

        document.cookie = name + '=' + escape(value) +
            ((expires) ? '; expires=' + expires : '') +
            ((path) ? '; path=' + path : '/') +
            ((domain) ? '; domain=' + domain : '') +
            ((secure) ? '; secure' : '');
    }

    var getGETParameterByName = function (name) {

        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    var setAffiliateOrPartnerCookie = function() {

        var codeRegex = /[^\w]/g;

        var partnerCode = getGETParameterByName('r').replace(codeRegex, '');
        var saleCode    = getGETParameterByName('s').replace(codeRegex, '');

        if (partnerCode.length) {

            setCookie('partner_referral_code', partnerCode, 31, '/');
        }

        if (saleCode.length) {

            setCookie('sales_referrer_name', saleCode, 31, '/');
        }
    };

    // Set wrikeLocale
    if (window.pageParams) {

        setCookie('appLocale', (window.pageParams.get('locale') || 'en'), 31, '/');
    }

    setAffiliateOrPartnerCookie();

})(window);