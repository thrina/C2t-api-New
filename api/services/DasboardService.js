var UserModel = require('../models/userModel');
var NewsModel = require('../models/newsModel')
var EventModel = require('../models/eventModel')
var Advertisments = require('../models/advertisementModel');
var Portfolio = require('../models/portfolio');
var pUtil = require('../util/PageUtil');
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
                    else rows.newsCount = 0;

                    EventModel.count('', function (err, value) {
                        if (value) rows.eventsCount = value;
                        else rows.eventsCount = 0;

                        Advertisments.count('', function (err, value) {
                            if (value) rows.advertismentsCount = value;
                            else rows.advertismentsCount = 0;

                            rows.status = "success";
                            return next(null, rows);
                        })

                    })
                })

            })

        })
    },

    search: function (req, sortBy, next) {
        var result = {};
        var Paging = pUtil.makeQuery(req, null, sortBy);
        delete req.query.sortBy;
        delete req.query.page;
        delete req.query.limit;
        var query = {};
        var orSearch = [];
        var portfolioQuery = {};
        var searchKey = req.query.searchText;

        var portfolioOrSearch = [];
        if (searchKey) {
            portfolioOrSearch.push({ 'talent': { $regex: searchKey, $options: "$i" } });
            portfolioOrSearch.push({ 'title': { $regex: searchKey, $options: "$i" } });
            portfolioOrSearch.push({ 'keywordGroup': { $regex: searchKey, $options: "$i" } });
        }
        if (portfolioOrSearch.length) { portfolioQuery["$or"] = portfolioOrSearch; }

        var userIDs = [];
        Portfolio.find(portfolioQuery, { userID: true }, null, function (err, portfolio) {
            if (portfolio.length >= 0) {
                _.each(portfolio, function (item) {
                    userIDs.push(item.userID);
                })
            };

            if (userIDs) {
                orSearch.push({ '_id': { "$in": userIDs } });
            }
            if (searchKey) {
                orSearch.push({ 'firstName': { $regex: searchKey, $options: "$i" } });
                orSearch.push({ 'lastName': { $regex: searchKey, $options: "$i" } });
            }
            if (orSearch.length) { query["$or"] = orSearch; }

            UserModel.count(query, function (err, value) {
                result.totalRecords = value;
                result.total = pUtil.calculateTotalPages(value, Paging['limit']);
                UserModel.find(query, null, Paging, function (err, users) {
                    if (err) {
                        return next({
                            "status": "Failed to query DB"
                        });
                    };
                    if (users.length >= 0) {
                        result.status = "success";
                        result.rows = users
                    };
                    return next(null, result);

                });
            });
        });


    }
}


