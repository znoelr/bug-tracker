import { BaseService } from '../base/base.service';
import { FileDto } from './dtos/file.dto';
import { fileRepository } from './file.repository';

export class FileService extends BaseService<FileDto> {}

export const fileService = new FileService(fileRepository);
