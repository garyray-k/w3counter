'use strict';

var cheerio = require('cheerio');
var got = require('got');

/**
 * w3counter API
 *
 * @param {String} type
 * @param {Function} cb
 * @api public
 */

module.exports = function (type, cb) {
    var types = {
        browser: 'Web Browsers',
        country: 'Countries',
        os: 'Operating Systems',
        res: 'Screen Resolutions'
    };
    var method = types[type];
    var ret = [];

    got('http://www.w3counter.com/globalstats.php', function (err, data) {
        if (err) {
            return cb(err);
        }

        var $ = cheerio.load(data);

        $('th').filter(function () {
            return this.text() === method;
        }).parent().nextAll('.item').each(function () {
            var obj = {
                item: this.text(),
                percent: $(this).next('.pct').text()
            };

            ret.push(obj);
        });

        if (ret.length === 0) {
            return cb('Couldn\'t get any ' + method.toLowerCase());
        }

        cb(null, ret);
    });
};
