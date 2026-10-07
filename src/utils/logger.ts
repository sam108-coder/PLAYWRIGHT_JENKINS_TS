export class Logger {
  private static formatTime(): string {
    return new Date().toISOString();
  }

  static info(message: string, ...args: any[]): void {
    console.log(`[INFO]  [${this.formatTime()}] ${message}`, ...args);
  }

  static debug(message: string, ...args: any[]): void {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] [${this.formatTime()}] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]): void {
    console.warn(`[WARN]  [${this.formatTime()}] ${message}`, ...args);
  }

  static error(message: string, ...args: any[]): void {
    console.error(`[ERROR] [${this.formatTime()}] ${message}`, ...args);
  }

  static step(stepName: string): void {
    console.log(`\n📌 STEP: ${stepName}`);
  }
}

