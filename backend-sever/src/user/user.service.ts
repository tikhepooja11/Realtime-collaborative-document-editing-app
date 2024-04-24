import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UpdateUserDto, UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,

    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async mapClientIdToUserId(
    fullname: string,
    email: string,
    clientId: string,
  ): Promise<User> {
    console.log('inside mapClientIdToUserId()');
    const fetchedUser = await this.getUserByEmail(email);
    // Update the existing user's clientId
    const updateUserDto: UpdateUserDto = {
      clientId,
    };
    const mappedUser = await this.updateUser(fetchedUser._id, updateUserDto);
    console.log(mappedUser + '\n');
    return mappedUser;
  }

  async getClientInfoByClientId(clientId: string) {
    const [user] = await this.userModel.find({ clientId }); //  returns array
    return user;
  }

  async createUser(userDto: UserDto): Promise<User> {
    const { fullname, email, password } = userDto;

    // Check if user with the same email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password before saving to database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      fullname,
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async deleteAllUsers(): Promise<any> {
    console.log('user-service : deleteAllUsers ');
    await this.userModel.deleteMany().exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getSharedWithDocumentsByUserId(userId: string) {
    // Promise<string[]>
    this.logger.log(`user-service : getSharedWithDocumentsByUserId`);
    // IMP NOTE - Find the user by userId and populate the 'sharedWith' field to retrieve the referenced Document IDs
    const user = await this.userModel
      .findById(userId)
      .populate('sharedWith', 'id');

    const sharedWithDocumentIds: string[] = user.sharedWith.map((document) =>
      document.id.toString(),
    );
    this.logger.log(sharedWithDocumentIds);

    const documentPromise = sharedWithDocumentIds.map((documentId) =>
      this.documentService.getDocumentById(documentId),
    );

    const sharedWithDocumentsList = await Promise.all(documentPromise);
    this.logger.log(sharedWithDocumentsList);
    return sharedWithDocumentsList;
  }
}
