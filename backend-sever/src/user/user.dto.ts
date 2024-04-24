import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IDocument } from 'src/document/document.schema';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  documents: IDocument[];

  @IsOptional()
  clientId: string;
}

export class UserSignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  fullname?: string;

  @IsOptional()
  @IsArray()
  // @ValidateNested({ each: true }) // Validate each item in the array
  // @Type(() => IDocument)
  documents?: IDocument[]; // Define documents as an array of IDocument objects

  @IsOptional()
  clientId?: string;

  @IsOptional()
  sharedWith?: IDocument[];
}
