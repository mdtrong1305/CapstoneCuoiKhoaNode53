import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { FOLDER_IMAGE } from '../constant/app.constant';

export function deleteFile(filePath: string) {
  const fileDeletePath = join(process.cwd(), FOLDER_IMAGE,filePath);
  if (existsSync(fileDeletePath)) {
    unlinkSync(fileDeletePath);
  } else {
    console.warn(`File ${fileDeletePath} không tồn tại, không thể xóa.`);
  }
}