import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';
import { IRequestWithUser } from './interface/IRequestWithUser';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.signIn(email, password);
  }

  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async tes(@Req() req: IRequestWithUser) {
    console.log(req.user.id);
    const dbUser = this.configService.get<string>('DATABASE_USER');
    return dbUser;
  }
}
