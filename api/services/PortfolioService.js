var pUtil = require('../util/PageUtil');
var Portfolio = require('../models/portfolio');
var _ = require('underscore');

module.exports = {

    find: function (req, sortBy, next) {
        var query = {};
        var Paging = pUtil.makeQuery(req, null, sortBy);
        delete req.query.sortBy;
        delete req.query.page;
        delete req.query.limit;

        var result = {};
        Portfolio.count(query, function (err, value) {
            result.totalRecords = value;
            result.total = pUtil.calculateTotalPages(value, Paging['limit']);
            Portfolio.find(req.query, "", Paging, function (err, data) {
                if (err) {
                    return next({
                        "status": "Failed to query DB"
                    });
                };
                if (data.length >= 0) {
                    result.status = "success";
                    result.rows = data
                };
                return next(null, result);

            });
        });
    },

    findOne: function (req, next) {
        var query = {}
        query._id = req.params.id;

        var result = {};
        Portfolio.find(query, function (err, data) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!data) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = data.length;
            result.rows = data;
            return next(null, result);

        });
    },

    create: function (req, obj, next) {
        Portfolio.create(req.body, function (err, data) {
            var result = {};
            if (err) {
                console.log("Error", err);
                return next({
                    "status": "Failed to query DB"
                })
            };
            if (!data) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = data.length;
            result.rows = data;
            return next(null, result);
        });
    },

    update: function (req, obj, next) {
        var query = {}
        query._id = req.params.id;
        Portfolio.findOne(query, function (err, retObj) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!retObj) {
                return next({
                    "status": "Item not found"
                });
            };
            delete obj.id;
            Portfolio.update(query, obj, function (err, data) {
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
        query._id = req.params.id;
        Portfolio.deleteMany(query).exec(function (err) {
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

