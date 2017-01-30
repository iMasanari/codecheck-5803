"use strict";
require("tslib");
var getCoefficients_1 = require("./getCoefficients");
var getPosChecker_1 = require("./getPosChecker");
function main(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var list, start, end, _a, coefficients, posChecker, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    list = JSON.parse(argv[0]);
                    start = argv[1], end = argv[2];
                    return [4 /*yield*/, Promise.all([
                            getCoefficients_1.default(list, start, end),
                            getPosChecker_1.default(list)
                        ])];
                case 1:
                    _a = _b.sent(), coefficients = _a[0], posChecker = _a[1];
                    result = {
                        coefficients: coefficients,
                        posChecker: posChecker
                    };
                    console.log(JSON.stringify(result));
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = main;
