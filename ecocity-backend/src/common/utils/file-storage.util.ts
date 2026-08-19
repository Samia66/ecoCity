import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';

/** Construit une config `multer.diskStorage` qui range les fichiers sous `uploadDir/<subfolder>/`. */
export function buildDiskStorage(uploadDir: string, subfolder: string) {
  const destination = join(process.cwd(), uploadDir, subfolder);
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }

  return diskStorage({
    destination,
    filename: (_req, file, callback) => {
      const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  });
}

export function toPublicFileUrl(publicUrl: string, subfolder: string, filename: string): string {
  return `${publicUrl}/uploads/${subfolder}/${filename}`;
}

export const IMAGE_MIME_REGEX = /\/(jpg|jpeg|png|webp|gif)$/;
