import { openDB } from "idb";

const DB_NAME = "ScreenshotDB";
const STORE_NAME = "screenshots";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

export const saveScreenshot = async (base64String) => {
  const db = await initDB();
  await db.add(STORE_NAME, {
    base64: base64String,
    timestamp: new Date(),
  });
};

export const getAllScreenshot = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export async function deleteScreenshots(id) {
  const db = await initDB();
  const tx = db.transaction("screenshots", "readwrite");
  const store = tx.objectStore("screenshots");
  await store.delete(id);
  await tx.done;
}
