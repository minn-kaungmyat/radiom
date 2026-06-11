import { get, set, del } from 'idb-keyval';

export const saveCustomBackgroundBlob = async (id: string, file: File): Promise<void> => {
  await set(`custom-bg-${id}`, file);
};

export const loadCustomBackgroundBlob = async (id: string): Promise<File | undefined> => {
  return await get(`custom-bg-${id}`);
};

export const deleteCustomBackgroundBlob = async (id: string): Promise<void> => {
  await del(`custom-bg-${id}`);
};
