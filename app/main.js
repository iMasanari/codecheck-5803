"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var request = require("request");
var ackey = '869388c0968ae503614699f99e09d960f9ad3e12';
function getUri(keyword, releaseDate, start) {
    var q = encodeURIComponent("Body:" + keyword + " AND ReleaseDate:" + releaseDate);
    return "http://54.92.123.84/search?q=" + q + "&rows=100&start=" + start + "&wt=json&ackey=" + ackey;
}
function sendRequest(url) {
    return new Promise(function (done) {
        request.get({ url: url, json: true, }, function (error, response, body) {
            done(body);
        });
    });
}
function main(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var list, start, end, startDate, endDate, weeks, docsList, countsList, coefficients;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    list = JSON.parse(argv[0]);
                    start = argv[1], end = argv[2];
                    startDate = getDateFrom1970_01_01(start);
                    endDate = getDateFrom1970_01_01(end);
                    weeks = (endDate - startDate) / 7 | 0;
                    return [4 /*yield*/, Promise.all(list.map(function (keyword) { return __awaiter(_this, void 0, void 0, function () {
                            var response, numFound, docs, promises, i, promise;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sendRequest(getUri(keyword, "[" + start + " TO " + end + "]", 0))];
                                    case 1:
                                        response = (_a.sent()).response;
                                        numFound = +response.result.numFound;
                                        docs = response.result.doc;
                                        promises = [];
                                        for (i = 1; (i - 1) * 100 <= numFound; ++i) {
                                            promise = sendRequest(getUri(keyword, "[" + start + " TO " + end + "]", i * 100)).then(function (_a) {
                                                var response = _a.response;
                                                if (response.result.doc) {
                                                    docs.push.apply(docs, response.result.doc);
                                                }
                                            });
                                            promises.push(promise);
                                            if (i > 100)
                                                break;
                                        }
                                        return [4 /*yield*/, Promise.all(promises)];
                                    case 2:
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
                    coefficients = countsList.map(function (value1) {
                        return countsList.map(function (value2) {
                            if (value1 === value2)
                                return 1;
                            var res = correlationCoefficient(value1, value2);
                            return res != null ? Math.round(res * 1000) / 1000 : null;
                        });
                    });
                    console.log(JSON.stringify({
                        coefficients: coefficients,
                        posChecker: true
                    }));
                    return [2 /*return*/];
            }
        });
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
function getDateFrom1970_01_01(yyyy_mm_dd) {
    var _a = yyyy_mm_dd.split('-').map(function (v) { return +v; }), year = _a[0], month = _a[1], date = _a[2];
    return new Date(year, month - 1, date).getTime() / (1000 * 60 * 60 * 24);
}
module.exports = main;
