import { AuthService } from './auth.service';
import { UserDto, UserSignInDto } from '../user/user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(userDto: UserDto): Promise<any>;
    signIn(userSignInDto: UserSignInDto): Promise<any>;
}
