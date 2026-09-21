import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

let ytApiPromise = null;
let ytApiReady = false;

const loadYtApi = () => {
  if (ytApiReady) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      ytApiReady = true;
      resolve();
    };
  });

  return ytApiPromise;
};

const getVideoId = (ytUrl) => {
  if (!ytUrl) return null;
  const match = ytUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/,
  );
  return match ? match[1] : null;
};

let portalRoot = null;
const getPortalRoot = () => {
  if (!portalRoot) {
    portalRoot = document.createElement("div");
    portalRoot.id = "yt-player-portal";
    document.body.appendChild(portalRoot);
  }
  return portalRoot;
};

const YoutubePlayer = ({
  url,
  playing,
  volume,
  onProgress,
  onDuration,
  onEnded,
  playerRef,
}) => {
  const containerRef = useRef(null);
  const localPlayerRef = useRef(null);
  const intervalRef = useRef(null);
  const callbacksRef = useRef({ onProgress, onDuration, onEnded });

  useEffect(() => {
    callbacksRef.current = { onProgress, onDuration, onEnded };
  });

  const videoId = getVideoId(url);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    let destroyed = false;

    loadYtApi().then(() => {
      if (destroyed) return;

      if (localPlayerRef.current) {
        try {
          localPlayerRef.current.destroy();
        } catch {
          /* ignore */
        }
      }

      const player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (!destroyed) {
              player.playVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              callbacksRef.current.onEnded?.();
            }
          },
        },
      });

      localPlayerRef.current = player;
      if (playerRef) playerRef.current = player;
    });

    return () => {
      destroyed = true;
      if (localPlayerRef.current) {
        try {
          localPlayerRef.current.destroy();
        } catch {
          /* ignore */
        }
        localPlayerRef.current = null;
        if (playerRef) playerRef.current = null;
      }
    };
  }, [videoId, playerRef]);

  useEffect(() => {
    const player = localPlayerRef.current;
    if (!player || !player.playVideo) return;

    if (playing) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [playing]);

  useEffect(() => {
    const player = localPlayerRef.current;
    if (!player || !player.setVolume) return;
    player.setVolume(Math.round(volume * 100));
  }, [volume]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const player = localPlayerRef.current;
      if (player && player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const dur = player.getDuration();
        if (dur > 0) {
          callbacksRef.current.onProgress?.({ playedSeconds: currentTime });
          callbacksRef.current.onDuration?.(dur);
        }
      }
    }, 250);

    return () => clearInterval(intervalRef.current);
  }, []);

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: -9999,
        width: 1,
        height: 1,
        opacity: 0,
      }}
    />,
    getPortalRoot(),
  );
};

export default YoutubePlayer;
