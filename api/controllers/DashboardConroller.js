const DasboardService = require('../services/DasboardService');

module.exports = {

    find: function (req, res) {
        DasboardService.find(req, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    }
}