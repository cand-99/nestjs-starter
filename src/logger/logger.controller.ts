import { Controller, Get } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('logger')
export class LoggerController {
  constructor(private readonly logger: LoggerService) {}

  @Public()
  @Get('info')
  getInfoLog() {
    this.logger.log(
      'This is an INFO log message from the LoggerController.',
      'LoggerController',
    );
    return 'Logged an INFO message.';
  }

  @Public()
  @Get('error')
  getErrorLog() {
    this.logger.error(
      'This is an ERROR log message from the LoggerController.',
      null,
      'LoggerController',
    );
    return 'Logged an ERROR message.';
  }
}
