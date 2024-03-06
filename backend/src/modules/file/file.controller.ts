import { BaseController } from "../base/base.controller";
import { FileDto } from "./dtos/file.dto";
import { fileService } from "./file.service";

class FileController extends BaseController<FileDto> {}

export default new FileController(FileDto, fileService);
