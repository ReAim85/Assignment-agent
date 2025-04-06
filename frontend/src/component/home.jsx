import { atom, useAtom } from "jotai";
import axios from "axios";
import ScreenshotGallery from "../screenshotgalary";
import { downloadpfd } from "./DownloadPDFbutton";
import { screenshotAtom } from "../assets/utility/state";

const aimsAtom = atom("");
let Base64String;

function Home() {
  const [aims, setAims] = useAtom(aimsAtom);
  const [screenshots] = useAtom(screenshotAtom);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://jg24nvtl-5000.inc1.devtunnels.ms/generate",
        { aims: aims.split("\n") },
        { headers: { "Content-Type": "application/json" } }
      );

      Base64String = res.data.Base64[0].screenshot;
      setAims("");
      // return <ScreenshotGallery newScreenshot={Base64String} />;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <center>
        <textarea
          placeholder="Enter Aim(s)..."
          value={aims}
          onChange={(e) => setAims(e.target.value)}
          className="block p-2.5 text-sm mt-5 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          rown={5}
          cols={40}
        />
        <br />
        <div>
          <button
            onClick={handleSubmit}
            className="mt-4 ml-5 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
          <button
            onClick={() => downloadpfd(screenshots)}
            className="mt-4 ml-5 px-4 py-2 bg-green-600 text-white rounded"
          >
            Download PDF
          </button>
        </div>
        <br />
        <ScreenshotGallery newScreenshot={Base64String} />
        {/* <img src={`${Base64String}`} alt="" /> */}
      </center>
    </>
  );
}

export default Home;
