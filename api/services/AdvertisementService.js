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
        if (req.query.advertisementDate) { query["advertisementDate"] = new Date(req.query.advertisementDate); }
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
        AdvertisementModel.findOne(query, function (err, advertisements) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
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
        if (req.body.advertisementDate) {
            req.body.advertisementDate = new Date(obj.advertisementDate);
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
            if (obj.advertisementDate) {
                obj.advertisementDate = new Date(obj.advertisementDate);
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

