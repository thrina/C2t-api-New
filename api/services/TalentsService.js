var pUtil = require('../util/PageUtil');
var Talent = require('../models/talentModel');
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
        Talent.count(query, function (err, value) {
            result.totalRecords = value;
            result.total = pUtil.calculateTotalPages(value, Paging['limit']);
            Talent.find(query, "", Paging, function (err, talents) {
                if (err) {
                    return next({
                        "status": "Failed to query DB"
                    });
                };
                if (talents.length >= 0) {
                    result.status = "success";
                    result.rows = talents
                };
                return next(null, result);

            });
        });
    },

    findOne: function (req, next) {
        var query = {}
        query._id = req.params.talentID;

        var result = {};
        Talent.find(query, function (err, talents) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!talents) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = talents.length;
            result.rows = talents;
            return next(null, result);

        });
    },

    create: function (req, obj, next) {
        if (!req.body.name) {
            return next({
                "message": "Name is mandatory"
            })
        }
        Talent.create(req.body, function (err, talents) {
            var result = {};
            if (err) {
                return next({
                    "status": "Failed to query DB"
                })
            };
            if (!talents) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = talents.length;
            result.rows = talents;
            return next(null, result);
        });
    },

    update: function (req, obj, next) {
        var query = {}
        query._id = req.params.talentID;
        Talent.findOne(query, function (err, retObj) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!retObj) {
                return next({
                    "status": "Talents not found"
                });
            };
            delete obj.id;
            Talent.update(query, obj, function (err, talents) {
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
        query._id = req.params.talentID;
        Talent.deleteMany(query).exec(function (err) {
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

