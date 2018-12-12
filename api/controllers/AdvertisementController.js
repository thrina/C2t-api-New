const AdvertisementService = require('../services/AdvertisementService');

module.exports = {

    find: function (req, res) {
        var sortBy = null;
        if (req.params.sortBy) {
            sortBy = req.params.sortBy;
        };
        AdvertisementService.find(req, sortBy, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    },

    findOne: function (req, res) {
        AdvertisementService.findOne(req, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    },

    create: function (req, res) {
        var obj = req.body;
        AdvertisementService.create(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    },

    update: function (req, res) {
        var obj = req.body;
        AdvertisementService.update(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    },

    delete: function (req, res) {
        var obj = req.body;
        AdvertisementService.delete(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    }

}