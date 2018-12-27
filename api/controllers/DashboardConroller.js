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
    },
    
    search: function (req, res) {
        var sortBy = null;
        if (req.params.sortBy) {
            sortBy = req.params.sortBy;
        };
        DasboardService.search(req, sortBy, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    }
}