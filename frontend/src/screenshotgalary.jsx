import { useAtom } from "jotai";
import { screenshotAtom } from "./assets/utility/state";
import {
  saveScreenshot,
  getAllScreenshot,
  deleteScreenshots,
} from "./assets/utility/db";
import { useEffect } from "react";

export default function ScreenshotGallery({ newScreenshot }) {
  const [screenshots, setScreenshot] = useAtom(screenshotAtom);

  useEffect(() => {
    const fetchScreenshots = async () => {
      const all = await getAllScreenshot();
      setScreenshot(all);
    };

    fetchScreenshots();
  }, [newScreenshot]);

  useEffect(() => {
    const saveAndFetch = async () => {
      if (newScreenshot) {
        await saveScreenshot({ screenshot: newScreenshot });
        const all = await getAllScreenshot();
        setScreenshot(all);
      }
    };
    saveAndFetch();
  }, [newScreenshot]);

  const handleDelete = async (id) => {
    await deleteScreenshots(id);
    setScreenshot((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {screenshots.map((s, index) => (
        <div key={s.id || index} className="relative">
          <img
            key={s.id || index}
            src={s.base64?.screenshot || "No Base64"}
            alt={`Screenshot ${index + 1}`}
            className="w-145 rounded shadow"
          />
          <button
            onClick={() => handleDelete(s.id)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 text-sm"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
