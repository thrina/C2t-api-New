var pUtil = require('../util/PageUtil');
var News = require('../models/newsModel');
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
        if (req.query.newsDate) { query["newsDate"] = new Date(req.query.newsDate); }
        if (req.query.status) { query["status"] = req.query.status; }

        var result = {};
        News.count(query, function (err, value) {
            result.totalRecords = value;
            result.total = pUtil.calculateTotalPages(value, Paging['limit']);
            News.find(query, "", Paging, function (err, news) {
                if (err) {
                    return next({
                        "status": "Failed to query DB"
                    });
                };
                if (news.length >= 0) {
                    result.status = "success";
                    result.rows = news
                };
                return next(null, result);

            });
        });
    },

    findOne: function (req, next) {
        var query = {}
        query._id = req.params.newsID;

        var result = {};
        News.findOne(query, function (err, news) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!news) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = news.length;
            result.rows = news;
            return next(null, result);

        });
    },

    create: function (req, obj, next) {
        if (!req.body.title) {
            return next({
                "message": "Title is mandatory"
            })
        }
        if (req.body.newsDate) {
            req.body.newsDate = new Date(obj.newsDate);
        };
        News.create(req.body, function (err, news) {
            var result = {};
            if (err) {
                return next({
                    "status": "Failed to query DB"
                })
            };
            if (!news) {
                next({
                    "status": "No data found"
                });
                return;
            };
            result.status = 'success';
            result.totalRecords = news.length;
            result.rows = news;
            return next(null, result);
        });
    },

    update: function (req, obj, next) {
        var query = {}
        query._id = req.params.newsID;
        News.findOne(query, function (err, retNews) {
            if (err) {
                return next({
                    "status": "Failed to query DB"
                });
            };
            if (!retNews) {
                return next({
                    "status": "News not found"
                });
            };
            delete obj.id;
            if (obj.newsDate) {
                obj.newsDate = new Date(obj.newsDate);
            };
            News.update(query, obj, function (err, news) {
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
        query._id = req.params.newsID;
        News.deleteMany(query).exec(function (err) {
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

