import fs from 'fs';
import SonicBoom from 'sonic-boom';
import { ConfigService } from '../../config/config.service';

let folderCreated = false;

const createLogFolder = () => {
  if (folderCreated) return;
  const folderPath = ConfigService.get<string>('LOG_FOLDER');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  folderCreated = true;
}

export default () => {
  createLogFolder();
  const [today] = new Date().toISOString().split('T');
  return new SonicBoom({ dest: `${ConfigService.get<string>('LOG_FOLDER')}/${today}.error.log` });
}
