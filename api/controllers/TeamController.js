const TeamsService = require('../services/TeamsService');

module.exports = {

    find: function (req, res) {
        var sortBy = null;
        if (req.params.sortBy) {
            sortBy = req.params.sortBy;
        };
        TeamsService.find(req, sortBy, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    },

    findOne: function (req, res) {
        TeamsService.findOne(req, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    },

    create: function (req, res) {
        var obj = req.body;
        TeamsService.create(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    },

    update: function (req, res) {
        var obj = req.body;
        TeamsService.update(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    },

    delete: function (req, res) {
        var obj = req.body;
        TeamsService.delete(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    }

}