import { createContext, useContext, useState, useCallback, useRef } from "react";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visible, setVisible] = useState(false);
  const playerRef = useRef(null);

  const getBestPvUrl = useCallback((song) => {
    if (!song?.pvs || song.pvs.length === 0) return null;

    const preferred = ["Youtube", "SoundCloud", "NicoNicoDouga", "Bilibili"];
    for (const service of preferred) {
      const pv = song.pvs.find(
        (p) => p.service === service && !p.disabled,
      );
      if (pv) return pv.url;
    }

    const firstEnabled = song.pvs.find((p) => !p.disabled);
    return firstEnabled?.url || null;
  }, []);

  const play = useCallback(
    (song) => {
      if (!song) return;

      const url = getBestPvUrl(song);
      if (!url) {
        console.warn("No PV available for this song");
        return;
      }

      if (currentSong?.id === song.id) {
        setIsPlaying((prev) => !prev);
      } else {
        setCurrentSong({ ...song, pvUrl: url });
        setPlayedSeconds(0);
        setDuration(0);
        setIsPlaying(true);
        setVisible(true);
      }
    },
    [currentSong, getBestPvUrl],
  );

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const seek = useCallback(
    (value) => {
      const player = playerRef.current;
      if (player && player.seekTo && duration > 0) {
        player.seekTo(value * duration, true);
      }
    },
    [duration],
  );

  const setVolume = useCallback((value) => {
    setVolumeState(value);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const handleProgress = useCallback(({ playedSeconds: ps }) => {
    setPlayedSeconds(ps);
  }, []);

  const handleDuration = useCallback((dur) => {
    setDuration(dur);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setPlayedSeconds(0);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        playedSeconds,
        duration,
        visible,
        playerRef,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        close,
        show,
        handleProgress,
        handleDuration,
        handleEnded,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
};
