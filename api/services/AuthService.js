var pUtil = require('../util/PageUtil');
const bcrypt = require('bcrypt');
var UserModel = require('../models/userModel');

module.exports = {

    findOne: function (req, next) {
        var query = {}
        query.email = req.body.email;

        UserModel.findOne(query, function (err, userInfo) {
            var result = {};
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            }
            if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {
                result.status = 'success';
                result.totalRecords = userInfo.length;
                result.rows = userInfo;
            } else {
                result.status = 'error';
                result.message = 'Invalid email/password!!!';
            }
            return next(null, result);

        });
    },

    create: function (req, obj, next) {
        var query = {}
        query.email = req.body.email;
        if (!req.body.email) {
            return next({
                "message": "email is mandatory"
            })
        }
        UserModel.findOne(query, function (err, userInfo) {
            var result = {};
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            }
            if (userInfo) {
                return next({
                    "status": "Email alreay exist."
                });
            }
            UserModel.create(req.body, function (err, users) {
                var result = {};
                if (err) {
                    return next({
                        "status": "Failed to query DB"
                    })
                };
                if (!users) {
                    next({
                        "status": "No data found"
                    });
                    return;
                };
                result.status = 'success';
                result.totalRecords = users.length;
                result.rows = users;
                return next(null, result);
            });
        });



    }
}

