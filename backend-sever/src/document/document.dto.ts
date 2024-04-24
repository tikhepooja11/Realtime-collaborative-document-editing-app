import { IsNotEmpty, IsOptional } from 'class-validator';

export class DocumentDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  userId: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  collaborators?: [string];
}

export class UpdateDocumentDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  collaborators?: [string];
}
