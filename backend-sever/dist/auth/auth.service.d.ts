import { JwtService } from '@nestjs/jwt';
import { UserDto, UserSignInDto } from '../user/user.dto';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly userService;
    constructor(jwtService: JwtService, userService: UserService);
    signUp(userDto: UserDto): Promise<any>;
    signIn(userSignInDto: UserSignInDto): Promise<any>;
}
