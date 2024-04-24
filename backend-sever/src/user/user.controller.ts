import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto'; // Import UserDto
import { User } from './user.schema';
import { DocumentController } from 'src/document/document.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(DocumentController.name);
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() userData: UserDto): Promise<User> {
    const newUser = await this.userService.createUser(userData);
    return newUser;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAllUsers(): Promise<any> {
    this.logger.log('user-controller : deleteAllUsers ');
    await this.userService.deleteAllUsers();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    this.logger.log(`user-controller - getAllUsers`);
    return await this.userService.getAllUsers();
  }

  @Get('/getSharedwithDocuments/:userId')
  @UseGuards(JwtAuthGuard)
  async getSharedWithDocumentsByUserId(@Param('userId') userId: string) {
    this.logger.log(`Inside user-controller - getSharedWithDocumentsByUserId `);
    return await this.userService.getSharedWithDocumentsByUserId(userId);
  }
}
