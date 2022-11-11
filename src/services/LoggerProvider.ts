import { LoggerTypeEnum } from '@/enums/LoggerTypeEnums';

class LoggerProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: LoggerProvider;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): LoggerProvider {
    if (!LoggerProvider.instance) {
      LoggerProvider.instance = new LoggerProvider();
    }

    return LoggerProvider.instance;
  }

  public defaultLogLevel: LoggerTypeEnum = LoggerTypeEnum.WARN;
  public showTimestamp = true;

  public Log(type: LoggerTypeEnum, message: string, ...optionalParams: any[]) {
    switch (type) {
      case LoggerTypeEnum.DEBUG:
        if (this.defaultLogLevel <= LoggerTypeEnum.DEBUG) {
          if (console.debug) {
            console.debug(this.addTimeStamp(message), ...optionalParams);
          } else {
            console.log(this.addTimeStamp(message, 'Debug'), ...optionalParams);
          }
        }
        break;
      case LoggerTypeEnum.INFO:
        if (this.defaultLogLevel <= LoggerTypeEnum.INFO) {
          if (console.info) {
            console.info(this.addTimeStamp(message), ...optionalParams);
          } else {
            console.log(this.addTimeStamp(message, 'Info'), ...optionalParams);
          }
        }
        break;
      case LoggerTypeEnum.WARN:
        if (this.defaultLogLevel <= LoggerTypeEnum.WARN) {
          if (console.warn) {
            console.warn(this.addTimeStamp(message), ...optionalParams);
          } else {
            console.log(this.addTimeStamp(message, 'Warning'), ...optionalParams);
          }
        }
        break;
      case LoggerTypeEnum.ERROR:
        if (this.defaultLogLevel <= LoggerTypeEnum.ERROR) {
          if (console.error) {
            console.error(this.addTimeStamp(message), ...optionalParams);
          } else {
            console.log(this.addTimeStamp(message, 'Error'), ...optionalParams);
          }
        }
        break;
      default:
        if (this.defaultLogLevel <= LoggerTypeEnum.DEBUG) {
          console.log(this.addTimeStamp(message, 'Verbose'), ...optionalParams);
        }
        break;
    }
  }

  public LogDebug(message: string, ...optionalParams: any[]) {
    this.Log(LoggerTypeEnum.DEBUG, message, optionalParams);
  }

  public LogInfo(message: string, ...optionalParams: any[]) {
    this.Log(LoggerTypeEnum.INFO, message, optionalParams);
  }

  public LogWarn(message: string, ...optionalParams: any[]) {
    this.Log(LoggerTypeEnum.WARN, message, optionalParams);
  }

  public LogError(message: string, ...optionalParams: any[]) {
    this.Log(LoggerTypeEnum.ERROR, message, optionalParams);
  }

  public error(message?: any, ...optionalParams: any[]) {
    this.Log(LoggerTypeEnum.ERROR, message, optionalParams);
  }
  public info(message?: any, ...optionalParams: any[]) {
    this.Log(LoggerTypeEnum.INFO, message, optionalParams);
  }
  public debug(message?: any, ...optionalParams: any[]) {
    this.Log(LoggerTypeEnum.DEBUG, message, optionalParams);
  }
  public warn(message?: any, ...optionalParams: any[]) {
    this.Log(LoggerTypeEnum.WARN, message, optionalParams);
  }

  private addTimeStamp(message: string, logType?: string): string {
    return `${this.showTimestamp === true ? '[' + new Date().toISOString() + ']' : ''} ${
      logType != null ? logType + ': ' : ''
    }${message}`;
  }
}

export default LoggerProvider;
