module.exports = {
    getPageStart: function (req) {
        // start -> Starting record location from where search should begin
        // page -> page number of grid
        // limit -> maximum number of records to be returned to front end
        // If start is sent, use that
        var start = getIntValue(req, "start");
        if (start > 0) {
            return start;
        }
        // If start is not sent, then calculate using page and limit.
        var page = getPageNumber(req);
        var pageSize = this.getPageSize(req);
        return ((page - 1) * pageSize);
    },

    getPageSize: function (req) {
        // Get page size from request
        var limit = getIntValue(req, "limit");
        if (limit === 0) {
            limit = getIntValue(req, "rows");
        }
        // If page size is not sent on request, send defaults
        if (limit < 1) {
            limit = 10;
        }
        return limit;
    },

    calculateTotalPages: function (totalRecords, pageSize) {
        return Math.ceil(totalRecords / pageSize);
    },

    makeQuery: function (req, where, sort) {
        var query = {};
        query.skip = this.getPageStart(req);
        query.limit = parseInt(this.getPageSize(req));
        query.page = parseInt(getPageNumber(req));
        var sortBy = req.query.sort || {
            'updatedAt': 'desc'
        };
        query.sort = sortBy;
        return query;
    }
};

function getIntValue(req, paramName, defaultValue) {

    if (!defaultValue) defaultValue = 0;
    //return check.isInt(req.param(paramName)) ? sanitize.toInt(req.param(paramName)) : defaultValue;
    return isInt(req.query[paramName]) ? req.query[paramName] : defaultValue;
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value;
}

function getPageNumber(req) {
    var page = getIntValue(req, "page", 1);
    if (page < 1) {
        page = 1;
    }
    return page;
}