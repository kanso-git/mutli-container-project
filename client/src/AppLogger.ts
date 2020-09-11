const ulog = require('ulog')

interface ILogMethods {
  error: any
  warn: any
  info: any
  log: any
  debug: any
  trace: any
}
export class AppLogger {
  private static instance: ILogMethods

  static getInstance(): ILogMethods {
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
      ulog.level = ulog.DEBUG
      AppLogger.instance = ulog
    }
    return AppLogger.instance
  }
}
