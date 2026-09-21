import youtube from "../assets/youtube.png";
import niconico from "../assets/niconico.png";
import soundcloud from "../assets/soundcloud.png";
import bilibili from "../assets/bilibili.png";
import bandcamp from "../assets/bandcamp.png";

export const PlatformCode = (code) => {
  if (code === "Youtube") {
    return <img style={{ width: "35px", height: "35px" }} src={youtube} />;
  } else if (code === "NicoNicoDouga") {
    return <img style={{ width: "35px", height: "35px" }} src={niconico} />;
  } else if (code === "SoundCloud") {
    return <img style={{ width: "35px", height: "35px" }} src={soundcloud} />;
  } else if (code === "Bilibili") {
    return <img style={{ width: "35px", height: "35px" }} src={bilibili} />;
  } else if (code === "Bandcamp") {
    return <img style={{ width: "35px", height: "35px" }} src={bandcamp} />;
  }
};
