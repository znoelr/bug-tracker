import fs from 'fs';
import SonicBoom from 'sonic-boom';
import { ConfigService } from '../../config/config.service';

let folderCreated = false;

const createFodler = () => {
  if (folderCreated) return;
  const folderPath = ConfigService.get<string>('LOG_FOLDER');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  folderCreated = true;
}

export default () => {
  createFodler();
  const [today] = new Date().toISOString().split('T');
  return new SonicBoom({ dest: `${ConfigService.get<string>('LOG_FOLDER')}/${today}.error.log` });
}
