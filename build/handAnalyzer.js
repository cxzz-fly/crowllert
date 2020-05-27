"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = __importStar(require("cheerio"));
var fs = require('fs');
var handAnalyzer = /** @class */ (function () {
    function handAnalyzer() {
    }
    handAnalyzer.getInstance = function () {
        if (!handAnalyzer.instance) {
            handAnalyzer.instance = new handAnalyzer();
        }
        return handAnalyzer.instance;
    };
    handAnalyzer.prototype.getCourseInfo = function (html) {
        var $ = cheerio.load(html);
        var courseItems = $('.note-list li');
        var courseInfos = [];
        courseItems.map(function (index, element) {
            var title = $(element).find('.title').text();
            var abstract = $(element).find('.abstract').text();
            var lick = $(element).find('.meta').find('span').eq(1).text();
            var ract = abstract.replace(/[\r\n]/g, "").replace(/\ +/g, "");
            courseInfos.push({
                title: title,
                abstract: ract,
                lick: lick
            });
        });
        var result = {
            time: new Date().getTime(),
            data: courseInfos
        };
        return result;
    };
    handAnalyzer.prototype.generateJsonContent = function (filePath, courseInfo) {
        var fileContent = {};
        var a = {};
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent;
    };
    handAnalyzer.prototype.analyze = function (html, filePath) {
        var courseInfo = this.getCourseInfo(html);
        var cont = this.generateJsonContent(filePath, courseInfo);
        return JSON.stringify(cont);
    };
    return handAnalyzer;
}());
exports.default = handAnalyzer;
