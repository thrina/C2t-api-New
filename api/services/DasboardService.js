var UserModel = require('../models/userModel');
var NewsModel = require('../models/newsModel')
var EventModel = require('../models/eventModel')
var Advertisments = require('../models/advertisementModel')
var _ = require('underscore');

module.exports = {

    find: function (req, next) {
        var rows = {};

        UserModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }], function (err, result) {
            var statusObj = {};
            if (result) {
                var keys = Object.keys(result);
                for (var i = 0; i < keys.length; i++) {
                    var status = result[keys[i]]._id;
                    var count = result[keys[i]].count;
                    statusObj[status] = count;
                }
                rows.statusCount = statusObj;
            }

            UserModel.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }], function (err, result) {
                var rolesObj = {};
                if (result) {
                    var keys = Object.keys(result);
                    for (var i = 0; i < keys.length; i++) {
                        var role = result[keys[i]]._id;
                        var count = result[keys[i]].count;
                        rolesObj[role] = count;
                    }
                }
                rows.usersCount = rolesObj;

                NewsModel.count('', function (err, value) {
                    if (value) rows.newsCount = value;

                    EventModel.count('', function (err, value) {
                        if (value) rows.eventsCount = value;

                        Advertisments.count('', function (err, value) {
                            if (value) rows.advertismentsCount = value;

                            console.log("Result", rows);
                            rows.status = "success";
                            return next(null, rows);
                        })

                    })
                })

            })

        })
    }
}


