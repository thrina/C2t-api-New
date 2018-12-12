var pUtil = require('../util/PageUtil');
var Category = require('../models/categoryModel');
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
            orSearch.push({ 'title': { $regex: searchKey, $options: "$i" } });
            // orSearch.push({ 'description': { $regex: searchKey, $options: "$i" } });
        }
        if (orSearch.length) { query["$or"] = orSearch; }

        var result = {};
        Category.count(query, function (err, value) {
            result.totalRecords = value;
            result.total = pUtil.calculateTotalPages(value, Paging['limit']);
            Category.find(query, "", Paging, function (err, categories) {
                if (err) {
                    return next({
                        "status": "Failed to query DB"
                    });
                };
                if (categories.length >= 0) {
                    result.status = "success";
                    result.rows = categories
                };
                return next(null, result);

            });
        });
    },

    findOne: function (req, next) {
        var query = {}
        query._id = req.params.categoryID;

        var result = {};
        Category.findOne(query, function (err, categories) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!categories) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = categories.length;
            result.rows = categories;
            return next(null, result);

        });
    },

    create: function (req, obj, next) {
        if (!req.body.name) {
            return next({
                "message": "Name is mandatory"
            })
        }
        Category.create(req.body, function (err, categories) {
            var result = {};
            if (err) {
                return next({
                    "status": "Failed to query DB"
                })
            };
            if (!categories) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = categories.length;
            result.rows = categories;
            return next(null, result);
        });
    },

    update: function (req, obj, next) {
        var query = {}
        query._id = req.params.categoryID;
        Category.findOne(query, function (err, retObj) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!retObj) {
                return next({
                    "status": "Categories not found"
                });
            };
            delete obj.id;
            Category.update(query, obj, function (err, categories) {
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
        query._id = req.params.categoryID;
        Category.deleteMany(query).exec(function (err) {
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

