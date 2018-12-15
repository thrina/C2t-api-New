const AuthService = require('../services/AuthService');

module.exports = {

    login: function (req, res) {
        AuthService.findOne(req, function (err, result) {
            if (err) {
                res.send(err);
                return;
            };
            res.send(result);
        });
    },

    signup: function (req, res) {
        var obj = req.body;
        AuthService.create(req, obj, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(result);
        });
    }
}