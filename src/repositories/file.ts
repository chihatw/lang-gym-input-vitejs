import { storage } from './firebase';

export const uploadFile = async (
  file: File,
  collection: 'articles' | 'ondokus'
) => {
  try {
    const snapshot = await storage
      .ref()
      .child(`${collection}/${new Date().getTime()}.mp3`)
      .put(file, { contentType: file.type });
    return { success: true, snapshot };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteFile = async (path: string) => {
  try {
    await storage.ref().child(path).delete();
    console.log('deleted file');
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
