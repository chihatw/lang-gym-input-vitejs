// https://firebase.google.com/docs/storage/web/upload-files
// https://firebase.google.com/docs/storage/web/delete-files
import { ref, uploadBytes, deleteObject, UploadResult } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFile = async (
  file: File,
  collection: 'articles' | 'ondokus'
): Promise<{
  success: boolean;
  snapshot?: UploadResult;
}> => {
  const storageRef = ref(storage, `${collection}/${new Date().getTime()}.mp3`);
  const metadata = { contentType: file.type };
  console.log('upload file');
  return uploadBytes(storageRef, file, metadata)
    .then((snapshot) => {
      return { success: true, snapshot };
    })
    .catch((error) => {
      console.warn(error);
      return { success: false };
    });
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  console.log('deleted file');
  return deleteObject(storageRef)
    .then(() => ({ success: true }))
    .catch((error) => {
      console.warn(error);
      return { success: false };
    });
};
