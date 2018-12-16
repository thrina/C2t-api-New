var pUtil = require('../util/PageUtil');
var UserModel = require('../models/userModel');
var _ = require('underscore');
const mongoose = require('mongoose');
const db = mongoose.connection;

module.exports = {

    find: function (req, sortBy, next) {
        var query = {};
        var Paging = pUtil.makeQuery(req, null, sortBy);
        delete req.query.sortBy;
        delete req.query.page;
        delete req.query.limit;

        var searchKey = req.query.searchText;

        var orSearch = [];
        if (searchKey) {
            orSearch.push({ 'firstName': { $regex: searchKey, $options: "$i" } });
            orSearch.push({ 'lastName': { $regex: searchKey, $options: "$i" } });
            orSearch.push({ 'email': { $regex: searchKey, $options: "$i" } });
            orSearch.push({ 'phone': { $regex: searchKey, $options: "$i" } });
            orSearch.push({ 'role': { $regex: searchKey, $options: "$i" } });
        }
        if (orSearch.length) { query["$or"] = orSearch; }

        var result = {};
        UserModel.count(query, function (err, value) {
            result.totalRecords = value;
            result.total = pUtil.calculateTotalPages(value, Paging['limit']);
            UserModel.find(query, "", Paging, function (err, users) {
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

        UserModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }], function (err, result) {
            var statusObj = {};
            if (result) {
                var keys = Object.keys(result);
                for (var i = 0; i < keys.length; i++) {
                    var status = result[keys[i]]._id;
                    var count = result[keys[i]].count;
                    statusObj[status] = count;
                }
                console.log("statusObj", statusObj);
            }
            UserModel.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }], function (err, result) {
                var rolesObj = {};
                var keys = Object.keys(result);
                for (var i = 0; i < keys.length; i++) {
                    var role = result[keys[i]]._id;
                    var count = result[keys[i]].count;
                    rolesObj[role] = count;
                }
                console.log("rolesObj", rolesObj);
            })

            
            console.log("dbValue-----", db.getCollection('news').count());

            // db.news.count, function (err, value) {
            //     console.log("news", value);
            // }
            // db.events.count, function (err, value) {
            //     console.log("events", value);
            // }
            // db.advitisments.count, function (err, value) {
            //     console.log("advitisments", value);
            // }
        })
    },

    findOne: function (req, next) {
        var query = {}
        query._id = req.params.userID;

        var result = {};
        UserModel.find(query, function (err, users) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
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
    },

    update: function (req, obj, next) {
        var query = {}
        query._id = req.params.userID;
        UserModel.findOne(query, function (err, retObj) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!retObj) {
                return next({
                    "status": "User not found"
                });
            };
            delete obj.id;
            UserModel.update(query, obj, function (err, users) {
                if (err) {
                    return next({
                        "status": "Failed to query DB"
                    });
                };

                next(null, {
                    "status": "success"
                });
            });
        });
    },

    delete: function (req, obj, next) {
        var query = {}
        query._id = req.params.userID;
        UserModel.deleteMany(query).exec(function (err) {
            if (err) {
                return res.send({
                    "status": "Failed to query DB"
                });
            }
            return next(null, {
                "status": "success"
            })
        });
    }
}

