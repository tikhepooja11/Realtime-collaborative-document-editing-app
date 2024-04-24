import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto, UserSignInDto } from '../user/user.dto';
import { UserModel } from '../user/user.schema';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(userDto: UserDto): Promise<any> {
    const { fullname, password, email } = userDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      fullname,
      password: hashedPassword,
      email,
    });
    await newUser.save();
    return { message: 'User registration successful' };
  }

  async signIn(userSignInDto: UserSignInDto): Promise<any> {
    const { email, password } = userSignInDto;
    const user = await this.userService.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.email, sub: user._id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
