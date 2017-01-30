"use strict";
require("tslib");
var request = require("request");
var ackey = '869388c0968ae503614699f99e09d960f9ad3e12';
function default_1(list, start, end) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var startDate, endDate, weeks, docsList, countsList, coefficients;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startDate = getDateFrom1970_01_01(start);
                    endDate = getDateFrom1970_01_01(end);
                    weeks = (endDate - startDate) / 7 | 0;
                    return [4 /*yield*/, Promise.all(list.map(function (keyword) { return __awaiter(_this, void 0, void 0, function () {
                            var response, numFound, docs, promises, i, promise;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sendRequest(keyword, "[" + start + " TO " + end + "]", 0)];
                                    case 1:
                                        response = _a.sent();
                                        numFound = +response.result.numFound;
                                        docs = response.result.doc;
                                        promises = [];
                                        for (i = 1; (i - 1) * 100 <= numFound; ++i) {
                                            promise = sendRequest(keyword, "[" + start + " TO " + end + "]", i * 100).then(function (response) {
                                                if (response.result.doc) {
                                                    docs.push.apply(docs, response.result.doc);
                                                }
                                            });
                                            promises.push(promise);
                                            if (i > 100)
                                                break;
                                        }
                                        // 読み込み完了を待つ
                                        return [4 /*yield*/, Promise.all(promises)];
                                    case 2:
                                        // 読み込み完了を待つ
                                        _a.sent();
                                        return [2 /*return*/, docs || []];
                                }
                            });
                        }); }))];
                case 1:
                    docsList = _a.sent();
                    countsList = docsList.map(function (docs) {
                        var counts = new Array(weeks).fill(0);
                        docs.forEach(function (doc) {
                            var date = getDateFrom1970_01_01(doc.ReleaseDate) - startDate;
                            var index = date / 7 | 0;
                            if (index < weeks)
                                ++counts[index];
                        });
                        return counts;
                    });
                    coefficients = countsList.map(function (value1) { return countsList.map(function (value2) {
                        if (value1 === value2)
                            return 1;
                        var res = correlationCoefficient(value1, value2);
                        return res != null ? Math.round(res * 1000) / 1000 : null;
                    }); });
                    return [2 /*return*/, coefficients];
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function getDateFrom1970_01_01(yyyy_mm_dd) {
    var _a = yyyy_mm_dd.split('-').map(function (v) { return +v; }), year = _a[0], month = _a[1], date = _a[2];
    return new Date(year, month - 1, date).getTime() / (1000 * 60 * 60 * 24);
}
function sendRequest(keyword, releaseDate, start) {
    var q = encodeURIComponent("Body:" + keyword + " AND ReleaseDate:" + releaseDate);
    var url = "http://54.92.123.84/search?q=" + q + "&rows=100&start=" + start + "&wt=json&ackey=" + ackey;
    return new Promise(function (done) {
        request.get({ url: url, json: true, }, function (error, response, body) { done(body.response); });
    });
}
function correlationCoefficient(dataX, dataY) {
    var len = dataX.length;
    // 平均
    var mx = dataX.reduce(function (a, b) { return a + b; }) / len;
    var my = dataY.reduce(function (a, b) { return a + b; }) / len;
    // 不偏分散
    var vx = dataX.reduce(function (prev, v) { return prev + Math.pow((v - mx), 2); }, 0) / (len - 1);
    var vy = dataY.reduce(function (prev, v) { return prev + Math.pow((v - my), 2); }, 0) / (len - 1);
    // 共分散
    var vxy = dataX.reduce(function (prev, dataX_i, i) { return prev + (dataX_i - mx) * (dataY[i] - my); }, 0) / (len - 1);
    // 標準偏差
    var sdx = Math.sqrt(vx);
    var sdy = Math.sqrt(vy);
    return sdx * sdy ? vxy / sdx / sdy : null;
}
