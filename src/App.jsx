import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "./utils/ThemeProvider";
import { AudioPlayerProvider } from "./utils/AudioPlayerContext";
import AudioPlayer from "./components/AudioPlayer";
import Detail from "./pages/Detail";
import ArtistDetail from "./pages/ArtistDetail";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AudioPlayerProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/song/:id" element={<Detail />} />
            <Route path="/artist/:id" element={<ArtistDetail />} />
          </Routes>
          <AudioPlayer />
        </AudioPlayerProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
