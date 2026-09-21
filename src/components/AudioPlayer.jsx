import { useState, useEffect } from "react";
import YoutubePlayer from "./YoutubePlayer";
import { useAudioPlayer } from "../utils/AudioPlayerContext";
import { useTheme } from "../utils/ThemeProvider";
import { DurationFormat } from "../utils/DurationFormat";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
};

const AudioPlayer = () => {
  const { theme } = useTheme();
  const {
    currentSong,
    isPlaying,
    volume,
    playedSeconds,
    duration,
    visible,
    playerRef,
    togglePlay,
    seek,
    setVolume,
    close,
    show,
    handleProgress,
    handleDuration,
    handleEnded,
  } = useAudioPlayer();

  const darkMode = theme === "dark";
  const isMobile = useMediaQuery("(max-width: 640px)");
  const progress = duration > 0 ? (playedSeconds / duration) * 100 : 0;

  const handleSeek = (e) => {
    const value = Number(e.target.value) / 100;
    seek(value);
  };

  if (!currentSong) return null;

  return (
    <>
      <YoutubePlayer
        url={currentSong.pvUrl}
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        playerRef={playerRef}
      />

      {/* Mini floating button when player is closed */}
      {!visible && (
        <button
          onClick={show}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 10000,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: darkMode ? "#5a8dee" : "#1a1a2e",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          {isPlaying ? (
            <Pause size={20} fill="#fff" color="#fff" />
          ) : (
            <Play size={20} fill="#fff" color="#fff" />
          )}
        </button>
      )}

      {/* Full player bar */}
      {visible && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: darkMode ? "#0f0f1a" : "#1a1a2e",
            borderTop: `1px solid ${darkMode ? "#3a3a5e" : "#ccc"}`,
            padding: isMobile ? "6px 10px" : "8px 20px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? 6 : 16,
          }}
        >
          {/* Close button (top-right on mobile, right on desktop) */}
          <button
            onClick={close}
            style={{
              position: isMobile ? "absolute" : "relative",
              top: isMobile ? 4 : "auto",
              right: isMobile ? 4 : "auto",
              order: isMobile ? 1 : 0,
              alignSelf: isMobile ? "flex-end" : "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              marginLeft: isMobile ? "auto" : 0,
            }}
          >
            <X size={isMobile ? 14 : 16} color="#999" />
          </button>

          {/* Song info */}
          <div
            style={{
              minWidth: 0,
              flex: isMobile ? "1 1 auto" : "0 0 200px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingRight: isMobile ? 24 : 0,
            }}
          >
            <div
              style={{
                width: isMobile ? 36 : 40,
                height: isMobile ? 36 : 40,
                borderRadius: 8,
                overflow: "hidden",
                flexShrink: 0,
                background: "#3a3a5e",
              }}
            >
              {currentSong.mainPicture?.urlOriginal && (
                <img
                  src={currentSong.mainPicture.urlOriginal}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: 600,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentSong.defaultName}
              </div>
              <div
                style={{
                  fontSize: isMobile ? 10 : 11,
                  color: "#888",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentSong.artistString?.split(" feat.")[0]}
              </div>
            </div>
          </div>

          {/* Controls + Progress */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              order: isMobile ? 3 : 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12 }}>
              <button
                onClick={togglePlay}
                style={{
                  width: isMobile ? 32 : 36,
                  height: isMobile ? 32 : 36,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isPlaying ? (
                  <Pause size={isMobile ? 16 : 18} fill="#000" color="#000" />
                ) : (
                  <Play size={isMobile ? 16 : 18} fill="#000" color="#000" />
                )}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "100%",
                maxWidth: isMobile ? "100%" : 600,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#999",
                  minWidth: 30,
                  textAlign: "right",
                }}
              >
                {DurationFormat(Math.round(playedSeconds))}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={handleSeek}
                style={{
                  flex: 1,
                  height: 4,
                  accentColor: "#5a8dee",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: 10, color: "#999", minWidth: 30 }}>
                {DurationFormat(Math.round(duration))}
              </span>
            </div>
          </div>

          {/* Volume - hidden on mobile */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                }}
              >
                {volume === 0 ? (
                  <VolumeX size={16} color="#999" />
                ) : (
                  <Volume2 size={16} color="#999" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={volume * 100}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                style={{
                  width: 70,
                  height: 4,
                  accentColor: "#5a8dee",
                  cursor: "pointer",
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AudioPlayer;
