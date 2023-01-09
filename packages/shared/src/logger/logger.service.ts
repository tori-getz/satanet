import { LoggerService as ILoggerService } from '@nestjs/common';
import { LOGO, NAME, SPACE, TITLE } from './logger.constants';
import * as colors from 'colors';

export class LoggerService implements ILoggerService {
  public log(message: any, ...optionalParams: any[]) {
    const generated = this.generateMessage(
      colors.gray('  LOG'),
      message,
      ...optionalParams,
    );

    console.log(generated);
  }
  public error(message: any, ...optionalParams: any[]) {
    const generated = this.generateMessage(
      colors.red('ERROR'),
      colors.red(message),
      ...optionalParams,
    );

    console.error(generated);
  }

  public warn(message: any, ...optionalParams: any[]) {
    const generated = this.generateMessage(
      colors.yellow(' WARN'),
      colors.yellow(message),
      ...optionalParams,
    );

    console.warn(generated);
  }

  private generateMessage(
    level: string,
    message,
    ...optionalParams: any[]
  ): string {
    const loggerName =
      typeof optionalParams[0] === 'string'
        ? colors.red(` [${optionalParams[0]}]`)
        : undefined;

    const msg = [
      this.getTime(),
      colors.red(NAME),
      SPACE,
      level,
      loggerName,
      message,
    ].join(' ');
    return msg;
  }

  private getTime(): string {
    const date = new Date();
    const timestamp = ` ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return colors.gray(timestamp);
  }

  public static startup(): void {
    console.log(colors.red(LOGO));
    console.log(colors.red(TITLE));
  }
}
