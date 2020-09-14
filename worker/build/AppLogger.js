"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = void 0;
var ulog = require('ulog');
var AppLogger = /** @class */ (function () {
    function AppLogger() {
    }
    AppLogger.getInstance = function () {
        /*
          ulog.NONE  // 0
          ulog.ERROR // 1
          ulog.WARN  // 2
          ulog.INFO  // 3
          ulog.LOG   // 4
          ulog.DEBUG // 5
          ulog.TRACE // 6
        */
        if (!AppLogger.instance) {
            ulog.level = ulog.DEBUG;
            AppLogger.instance = ulog;
        }
        return AppLogger.instance;
    };
    return AppLogger;
}());
exports.AppLogger = AppLogger;
