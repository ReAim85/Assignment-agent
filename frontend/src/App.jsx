import Home from "./component/home.jsx";
import { Provider } from "jotai";

function App() {
  return (
    <>
      <Provider>
        <Home />
      </Provider>
    </>
  );
}

export default App;
