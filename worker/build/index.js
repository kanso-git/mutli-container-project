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
var redis_1 = __importDefault(require("redis"));
var AppLogger_1 = require("./AppLogger");
var keys = __importStar(require("./keys"));
var logger = AppLogger_1.AppLogger.getInstance();
var redisClient = redis_1.default.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: function () { return 1000; },
});
// we are making these duplicate connections in both files because according to docs
// if we ever have a client that's listening or publishing information on redis we have to make a duplicate
// connection because when a connection is turned into a connection that's going to listen or subscribe or publish
// information it cannot be used for other purposes
var sub = redisClient.duplicate();
/**
 *
 * @param index
 */
var fib = function (index) {
    var val = index < 2 ? 1 : fib(index - 1) + fib(index - 2);
    logger.info("Recieved index:" + index + ", fib(" + index + ")=" + val);
    return val;
};
sub.on('message', function (channel, message) {
    logger.info("on message channel:" + channel + ", message=" + message);
    redisClient.hset('values', message, "" + fib(parseInt(message)));
});
sub.subscribe('insert');
logger.info("Worker is up and running ...");
