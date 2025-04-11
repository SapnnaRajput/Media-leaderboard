import DatauriParser from 'datauri/parser.js';
import path from 'path';

const parser = new DatauriParser();

// Convert buffer to data URI
export const dataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    console.error('Invalid file object passed to dataUri:', file);
    return null;
  }

  const extName = path.extname(file.originalname).toString();
  const dataUriContent = parser.format(extName, file.buffer);

  return dataUriContent?.content || null;
};
