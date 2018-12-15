var pUtil = require('../util/PageUtil');
var EventModel = require('../models/eventModel');
var _ = require('underscore');

module.exports = {

    find: function (req, sortBy, next) {
        var query = {};
        var Paging = pUtil.makeQuery(req, null, sortBy);
        delete req.query.sortBy;
        delete req.query.page;
        delete req.query.limit;

        var searchKey = req.query.searchText;
        var category = req.query.category;

        var orSearch = [];
        if (searchKey) {
            orSearch.push({ 'title': { $regex: searchKey, $options: "$i" } });
            orSearch.push({ 'description': { $regex: searchKey, $options: "$i" } });
        }
        if (orSearch.length) { query["$or"] = orSearch; }
        if (category) { query["category"] = category; }
        if (req.query.eventDate) { query["eventDate"] = new Date(req.query.eventDate); }
        if (req.query.status) { query["status"] = req.query.status; }

        var result = {};
        EventModel.count(query, function (err, value) {
            result.totalRecords = value;
            result.total = pUtil.calculateTotalPages(value, Paging['limit']);
            EventModel.find(query, "", Paging, function (err, events) {
                if (err) {
                    return next({
                        "status": "Failed to query DB"
                    });
                };
                if (events.length >= 0) {
                    result.status = "success";
                    result.rows = events
                };
                return next(null, result);

            });
        });
    },

    findOne: function (req, next) {
        var query = {}
        query._id = req.params.eventID;

        var result = {};
        EventModel.find(query, function (err, events) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!events) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = events.length;
            result.rows = events;
            return next(null, result);

        });
    },

    create: function (req, obj, next) {
        if (!req.body.title) {
            return next({
                "message": "Title is mandatory"
            })
        }
        if (req.body.eventDate) {
            req.body.eventDate = new Date(obj.eventDate);
        };
        EventModel.create(req.body, function (err, events) {
            var result = {};
            if (err) {
                return next({
                    "status": "Failed to query DB"
                })
            };
            if (!events) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = events.length;
            result.rows = events;
            return next(null, result);
        });
    },

    update: function (req, obj, next) {
        var query = {}
        query._id = req.params.eventID;
        EventModel.findOne(query, function (err, retData) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!retData) {
                return next({
                    "status": "Event not found"
                });
            };
            delete obj.id;
            if (obj.eventDate) {
                obj.eventDate = new Date(obj.eventDate);
            };
            EventModel.update(query, obj, function (err, events) {
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
        query._id = req.params.eventID;
        EventModel.deleteMany(query).exec(function (err) {
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

