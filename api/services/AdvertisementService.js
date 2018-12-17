var pUtil = require('../util/PageUtil');
var AdvertisementModel = require('../models/advertisementModel');
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
        if (req.query.date) { query["date"] = new Date(req.query.date); }
        if (req.query.status) { query["status"] = req.query.status; }

        var result = {};
        AdvertisementModel.count(query, function (err, value) {
            result.totalRecords = value;
            result.total = pUtil.calculateTotalPages(value, Paging['limit']);
            AdvertisementModel.find(query, "", Paging, function (err, advertisements) {
                if (err) {
                    return next({
                        "status": "Failed to query DB"
                    });
                };
                if (advertisements.length >= 0) {
                    result.status = "success";
                    result.rows = advertisements
                };
                return next(null, result);

            });
        });
    },

    findOne: function (req, next) {
        var query = {}
        query._id = req.params.advertisementID;

        var result = {};
        AdvertisementModel.find(query, function (err, advertisements) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!advertisements) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = advertisements.length;
            result.rows = advertisements;
            return next(null, result);

        });
    },

    create: function (req, obj, next) {
        if (!req.body.title) {
            return next({
                "message": "Title is mandatory"
            })
        }
        if (req.body.date) {
            req.body.date = new Date(obj.date);
        };
        AdvertisementModel.create(req.body, function (err, advertisements) {
            var result = {};
            if (err) {
                return next({
                    "status": "Failed to query DB"
                })
            };
            if (!advertisements) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = advertisements.length;
            result.rows = advertisements;
            return next(null, result);
        });
    },

    update: function (req, obj, next) {
        var query = {}
        query._id = req.params.advertisementID;
        AdvertisementModel.findOne(query, function (err, retData) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!retData) {
                return next({
                    "status": "advitisment not found"
                });
            };
            delete obj.id;
            if (obj.date) {
                obj.date = new Date(obj.date);
            };
            AdvertisementModel.update(query, obj, function (err, advertisements) {
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
        query._id = req.params.advertisementID;
        AdvertisementModel.deleteMany(query).exec(function (err) {
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

