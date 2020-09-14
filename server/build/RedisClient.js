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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
var redis_1 = __importDefault(require("redis"));
var AppLogger_1 = require("./AppLogger");
var keys = __importStar(require("./keys"));
var logger = AppLogger_1.AppLogger.getInstance();
var RedisClient = /** @class */ (function () {
    function RedisClient() {
    }
    RedisClient.getInstance = function () {
        if (!RedisClient.instance) {
            logger.log("keys.redisHost:" + keys.redisHost);
            logger.log("keys.redisPort:" + keys.redisPort);
            /**
             * Redis client setup
             */
            var redisClient = redis_1.default.createClient({
                host: keys.redisHost,
                port: keys.redisPort,
                retry_strategy: function () { return 1000; },
            });
            RedisClient.instance = redisClient;
            // we are making these duplicate connections in both files because according to docs
            // if we ever have a client that's listening or publishing information on redis we have to make a duplicate
            // connection because when a connection is turned into a connection that's going to listen or subscribe or publish
            // information it cannot be used for other purposes
            // RedisClient.redisPublisher = redisClient.duplicate()
        }
        return RedisClient.instance;
    };
    return RedisClient;
}());
exports.RedisClient = RedisClient;
