import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { User } from './user.schema';
export declare class UserController {
    private readonly userService;
    private readonly logger;
    constructor(userService: UserService);
    registerUser(userData: UserDto): Promise<User>;
    getUserById(id: string): Promise<User>;
    deleteAllUsers(): Promise<any>;
    getAllUsers(): Promise<User[]>;
    getSharedWithDocumentsByUserId(userId: string): Promise<import("../document/document.schema").IDocument[]>;
}
