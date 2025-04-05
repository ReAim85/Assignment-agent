import { atom, useAtom } from "jotai";
import axios from "axios";

const aimsAtom = atom("");

function Home() {
  const [aims, setAims] = useAtom(aimsAtom);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://jg24nvtl-5000.inc1.devtunnels.ms/generate",
        { aims: aims.split("\n") },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(aims);
      console.log(res.data);
      setAims("");
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
          rown={5}
          cols={40}
        />
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </center>
    </>
  );
}

export default Home;
