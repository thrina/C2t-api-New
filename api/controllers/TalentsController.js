const TalentsService = require('../services/TalentsService');

module.exports = {

    find: function (req, res) {
        var sortBy = null;
        if (req.params.sortBy) {
            sortBy = req.params.sortBy;
        };
        TalentsService.find(req, sortBy, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    },

    findOne: function (req, res) {
        TalentsService.findOne(req, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    },

    create: function (req, res) {
        var obj = req.body;
        TalentsService.create(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    },

    update: function (req, res) {
        var obj = req.body;
        TalentsService.update(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    },

    delete: function (req, res) {
        var obj = req.body;
        TalentsService.delete(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    }

}