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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDB = exports.getClient = void 0;
var pg_1 = require("pg");
var AppLogger_1 = require("./AppLogger");
var keys = __importStar(require("./keys"));
var logger = AppLogger_1.AppLogger.getInstance();
var connectionString = "postgressql://" + keys.pgUser + ":" + keys.pgPassword + "@" + keys.pgHost + ":" + keys.pgPort + "/" + keys.pgDatabase;
var getClient = function () {
    logger.info("connectionString:" + connectionString + " ");
    return new pg_1.Client({
        connectionString: connectionString,
    });
};
exports.getClient = getClient;
var initializeDB = function () {
    return new Promise(function (resolve, reject) {
        var client = new pg_1.Client({
            connectionString: connectionString,
        });
        client.connect();
        client.query('CREATE TABLE IF NOT EXISTS values (number INT)', function (err, resp) {
            logger.log(' Initialize DB ');
            if (err) {
                logger.error(err.message);
            }
            else {
                resolve('DB initialization done successulfy');
                client.end();
            }
        });
    });
};
exports.initializeDB = initializeDB;
