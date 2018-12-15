var pUtil = require('../util/PageUtil');
var UserModel = require('../models/userModel');
var _ = require('underscore');

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
            orSearch.push({ 'roleCode': { $regex: searchKey, $options: "$i" } });
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

