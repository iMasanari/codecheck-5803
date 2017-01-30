"use strict";
require("tslib");
var kuromoji = require("kuromoji");
function default_1(keywords) {
    return __awaiter(this, void 0, void 0, function () {
        var builder, tokenizer, list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = kuromoji.builder({
                        dicPath: 'node_modules/kuromoji/dict'
                    });
                    return [4 /*yield*/, new Promise(function (done) {
                            builder.build(function (err, tokenizer) { done(tokenizer); });
                        })];
                case 1:
                    tokenizer = _a.sent();
                    list = keywords.map(function (keyword) {
                        return tokenizer.tokenize(keyword)
                            .map(function (features) { return features.surface_form === 'ド' ? '名詞' : features.pos; })
                            .filter(function (pos, i, array) { return pos !== '名詞' || array[i - 1] !== '名詞'; })
                            .join(' ');
                    });
                    return [2 /*return*/, list.every(function (token) { return token === list[0]; })];
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
