import { ConsoleLogger } from '@nestjs/common'
import * as chalk from 'chalk'

export class CallistoLogger extends ConsoleLogger {
  private readonly default: chalk.ChalkFunction;

  constructor(context: string) {
    super(context);
    this.default = chalk.hex('#aaa')
  }

  log(message: string, ...rest: any[]) {
    super.log(this.default(message), ...rest)
  }

  colored(message: string, color: string) {
    super.log(chalk.hex(color)(message))
  }
}
