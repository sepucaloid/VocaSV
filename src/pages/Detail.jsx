import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Badge } from "react-bootstrap";
import {
  Music,
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Share2,
  ListMusic,
  Download,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { getDetail, getLyric } from "../services/song.services";
import { getDownloadLinks, downloadFile } from "../utils/download.services";
import { useTheme } from "../utils/ThemeProvider";
import { useAudioPlayer } from "../utils/AudioPlayerContext";
import { DurationFormat } from "../utils/DurationFormat";
import { BpmFormat } from "../utils/BpmFormat";
import { DateFormat } from "../utils/DateFormat";
import { LangCode } from "../utils/LangCode";
import { PlatformCode } from "../components/PlatformCode";
import Layout from "../components/Layout";

const PALETTE = [
  "#b5c8e8",
  "#c8b5e8",
  "#b5e8c8",
  "#e8d5b5",
  "#e8b5b5",
  "#b5dce8",
  "#e8c8b5",
  "#d5b5e8",
];

const Detail = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { play, currentSong, isPlaying, playedSeconds, duration, seek } = useAudioPlayer();

  const [data, setData] = useState(null);
  const [lyric, setLyric] = useState("");
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [downloadLinks, setDownloadLinks] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [copied, setCopied] = useState(false);

  const darkMode = theme === "dark";
  const cardBg = darkMode ? "#2a2a3e" : "#d9d9d9";
  const textColor = darkMode ? "#e0e0e0" : "#212529";
  const borderColor = darkMode ? "#3a3a5e" : "#ccc";
  const mutedColor = darkMode ? "#888" : "#666";
  const artColor = PALETTE[(data?.song?.id || 0) % PALETTE.length];

  const song = data?.song;
  const progress = duration > 0 ? (playedSeconds / duration) * 100 : 0;
  const elapsedMin = Math.floor(playedSeconds / 60);
  const elapsedSec = String(Math.floor(playedSeconds % 60)).padStart(2, "0");

  const tags = data?.tags?.map((item) => item?.tag);

  const producers = data?.artists?.filter((a) => a.categories?.includes("Producer")) || [];
  const vocalists = data?.artists?.filter((a) => a.categories === "Vocalist") || [];
  const otherArtists = data?.artists?.filter((a) =>
    a.categories?.includes("Illustrator") ||
    a.categories?.includes("Animator") ||
    a.categories === "Circle" ||
    a.categories === "Other"
  ) || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await getDetail(id);
        if (!cancelled) setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (data?.lyricsFromParents?.length > 0) {
      let cancelled = false;
      const run = async () => {
        try {
          const res = await getLyric(data.lyricsFromParents[activeLyricIndex]?.id);
          if (!cancelled) setLyric(res?.data?.value || "");
        } catch (e) {
          console.error(e);
        }
      };
      run();
      return () => { cancelled = true; };
    }
  }, [data, activeLyricIndex]);

  const youtubePv = data?.pvs?.find(
    (pv) => pv.service === "Youtube" || pv.url?.includes("youtu")
  );

  const copySongInfo = async () => {
    const lines = [];

    lines.push(`Name\t${song.defaultName}`);

    if (data?.additionalNames) {
      lines.push(data.additionalNames);
    }

    if (vocalists.length > 0) {
      lines.push(`Vocalists\t${vocalists.map((a) => a.artist?.name).join(", ")}`);
    }

    if (producers.length > 0) {
      lines.push(`Producers\t${producers.map((a) => a.artist?.name).join(", ")}`);
    }

    const animators = data?.artists?.filter((a) => a.categories?.includes("Animator")) || [];
    if (animators.length > 0) {
      lines.push(`Animators\t${animators.map((a) => a.artist?.name).join(", ")}`);
    }

    if (otherArtists.length > 0) {
      lines.push(`Other artists\t${otherArtists.map((a) => `${a.artist?.name} (${a.effectiveRoles})`).join(", ")}`);
    }

    lines.push(`Type\t${song.songType === "Original" ? "O Original song" : song.songType}`);
    lines.push(`Duration\t${DurationFormat(song.lengthSeconds)}`);
    lines.push(`Language(s)\t${song.defaultNameLanguage}`);
    lines.push(`BPM\t${BpmFormat(data?.minMilliBpm, data?.maxMilliBpm)}`);

    if (tags?.length > 0) {
      lines.push(`Tags\t${tags.map((t) => t?.name).join(", ")}`);
    }

    if (data?.pvs?.length > 0) {
      const pvLines = data.pvs.map((pv) => `${pv.service}\t${pv.name || pv.service}\t${pv.url}`);
      lines.push(`PV Sources\t`);
      lines.push(pvLines.join("\n"));
    }

    const stats = [];
    if (song.favoritedTimes) stats.push(`${song.favoritedTimes} favorite(s)`);
    if (song.ratingScore) stats.push(`${song.ratingScore} total score`);
    if (data?.hits) stats.push(`${data.hits} hit(s)`);
    if (stats.length > 0) {
      lines.push(`Statistics\t${stats.join(", ")}`);
    }

    lines.push(`Published\t${DateFormat(song.publishDate)}`);

    if (lyric) {
      lines.push("");
      lines.push(lyric);
    }

    const text = lines.join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed:", e);
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (activeTab !== "download" || !youtubePv || downloadLinks || loadingDownload) return;

    let cancelled = false;
    const run = async () => {
      setLoadingDownload(true);
      try {
        const links = await getDownloadLinks(youtubePv.url);
        if (!cancelled) {
          setDownloadLinks(links);
        }
      } catch (e) {
        console.error("Download fetch error:", e);
        if (!cancelled) {
          setDownloadError("Failed to load download options");
        }
      } finally {
        if (!cancelled) setLoadingDownload(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [activeTab, youtubePv, downloadLinks, loadingDownload]);

  if (loading) {
    return (
      <Layout isBack={true}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className={`spinner-border ${theme === "dark" ? "text-white" : "text-black"}`} role="status" style={{ width: 50, height: 50 }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!song) {
    return (
      <Layout isBack={true}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Song not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isBack={true}>
      {/* Page body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "20px 20px 100px",
          minHeight: 0,
        }}
        className={darkMode ? "scroll-dark" : "scroll-light"}
      >
        {/* Top row: album art + info */}
        <Row className="g-3 mb-3">
          {/* Album art */}
          <Col xs={12} md={4}>
            <div
              style={{
                borderRadius: 24,
                border: `2px solid ${borderColor}`,
                background: artColor,
                aspectRatio: "4/3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                minHeight: 180,
              }}
            >
              {song.mainPicture?.urlOriginal ? (
                <img
                  src={song.mainPicture.urlOriginal}
                  alt={song.defaultName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Music size={80} color="rgba(0,0,0,0.18)" />
              )}
              {/* Play overlay */}
              <button
                onClick={() => {
                  if (data) {
                    play({ ...data.song, pvs: data.pvs });
                  }
                }}
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.55)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                {currentSong?.id === song?.id && isPlaying ? (
                  <Pause size={22} fill="#fff" color="#fff" />
                ) : (
                  <Play size={22} fill="#fff" color="#fff" />
                )}
              </button>
            </div>
          </Col>

          {/* Info Music */}
          <Col xs={12} md={8}>
            <div
              style={{
                borderRadius: 24,
                border: `2px solid ${borderColor}`,
                background: cardBg,
                padding: "24px 28px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 180,
              }}
            >
              {/* Title + actions */}
              <div className="d-flex align-items-start justify-content-between mb-2">
                <div style={{ minWidth: 0, flex: 1, paddingRight: 12 }}>
                  <h3
                    style={{
                      fontWeight: 800,
                      color: darkMode ? "#fff" : "#1a1a2e",
                      marginBottom: 4,
                      fontSize: "clamp(20px, 3vw, 32px)",
                    }}
                  >
                    {song.defaultName}
                  </h3>
                  <p
                    style={{
                      color: mutedColor,
                      fontSize: 15,
                      marginBottom: 10,
                    }}
                  >
                    {producers.length > 0
                      ? producers.map((a, i) => (
                          <span key={a.artist?.id}>
                            {i > 0 && ", "}
                            <Link
                              to={`/artist/${a.artist?.id}`}
                              className="artist-link"
                              style={{ color: mutedColor, textDecoration: "underline" }}
                            >
                              {a.artist?.name}
                            </Link>
                          </span>
                        ))
                      : data?.artistString?.split(" feat.")[0]}
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge
                      style={{
                        background: artColor,
                        color: "#333",
                        fontWeight: 500,
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 20,
                      }}
                    >
                      {song.songType}
                    </Badge>
                    <Badge
                      style={{
                        background: darkMode ? "#3a3a5e" : "#e0e0e0",
                        color: textColor,
                        fontWeight: 500,
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 20,
                      }}
                    >
                      {DurationFormat(song.lengthSeconds)}
                    </Badge>
                  </div>
                </div>
                <div className="d-flex gap-3 align-items-center flex-shrink-0">
                  <button
                    onClick={() => setLiked((p) => !p)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <Heart
                      size={22}
                      fill={liked ? "#ee0055" : "none"}
                      color={liked ? "#ee0055" : "#999"}
                    />
                  </button>
                  <button
                    onClick={copySongInfo}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                    title={copied ? "Copied!" : "Copy song info"}
                  >
                    {copied ? (
                      <Check size={20} color="#4caf50" />
                    ) : (
                      <Copy size={20} color="#999" />
                    )}
                  </button>
                  <Share2
                    size={20}
                    color="#999"
                    style={{ cursor: "pointer" }}
                  />
                  <MoreHorizontal
                    size={22}
                    color="#999"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => seek(Number(e.target.value) / 100)}
                  style={{
                    width: "100%",
                    accentColor: "#5a8dee",
                    cursor: "pointer",
                    height: 4,
                  }}
                />
                <div className="d-flex justify-content-between">
                  <span style={{ fontSize: 12, color: "#999" }}>
                    {elapsedMin}:{elapsedSec}
                  </span>
                  <span style={{ fontSize: 12, color: "#999" }}>
                    {DurationFormat(song.lengthSeconds)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="d-flex align-items-center justify-content-between">
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <Shuffle size={18} color="#999" />
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <SkipBack size={22} color={textColor} />
                </button>
                <button
                  onClick={() => {
                    if (data) {
                      play({ ...data.song, pvs: data.pvs });
                    }
                  }}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: "#1a1a2e",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {currentSong?.id === song?.id && isPlaying ? (
                    <Pause size={22} fill="#fff" color="#fff" />
                  ) : (
                    <Play size={22} fill="#fff" color="#fff" />
                  )}
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <SkipForward size={22} color={textColor} />
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <Repeat size={18} color="#999" />
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Details panel — full width */}
        <div
          style={{
            borderRadius: 24,
            border: `2px solid ${borderColor}`,
            background: cardBg,
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: `1px solid ${borderColor}`,
              padding: "0 24px",
              gap: 4,
            }}
          >
            {[
              { key: "details", label: "Details", icon: <Music size={15} /> },
              { key: "lyrics", label: "Lyrics", icon: <ListMusic size={15} /> },
              { key: "download", label: "Download", icon: <Download size={15} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "14px 16px",
                  fontSize: 14,
                  fontWeight: activeTab === tab.key ? 700 : 400,
                  color: activeTab === tab.key ? "#5a8dee" : mutedColor,
                  borderBottom:
                    activeTab === tab.key
                      ? "2px solid #5a8dee"
                      : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: -1,
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: "24px 28px" }}>
            {activeTab === "lyrics" && (
              <div>
                {/* Lyrics language selector */}
                {data?.lyricsFromParents?.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {data.lyricsFromParents.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveLyricIndex(index)}
                        style={{
                          background:
                            activeLyricIndex === index
                              ? "#5a8dee"
                              : darkMode
                                ? "#3a3a5e"
                                : "#e0e0e0",
                          color:
                            activeLyricIndex === index
                              ? "#fff"
                              : textColor,
                          border: "none",
                          borderRadius: 20,
                          padding: "4px 14px",
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        {item.cultureCodes
                          ? item.cultureCodes.map((code, idx) => (
                              <span key={idx}>
                                {LangCode(
                                  code,
                                  item.translationType === "Romanized",
                                  item.translationType === "Original",
                                )}
                              </span>
                            ))
                          : "Unknown"}
                      </button>
                    ))}
                  </div>
                )}
                <pre
                  style={{
                    fontFamily: "inherit",
                    fontSize: 14,
                    lineHeight: 1.85,
                    color: textColor,
                    whiteSpace: "pre-wrap",
                    margin: 0,
                  }}
                >
                  {lyric || "No lyrics available."}
                </pre>
              </div>
            )}

            {activeTab === "details" && (
              <div>
                <Row className="g-3">
                  {[
                    { label: "Title", value: song.defaultName },
                    { label: "Type", value: song.songType },
                    {
                      label: "Duration",
                      value: DurationFormat(song.lengthSeconds),
                    },
                    {
                      label: "Published",
                      value: DateFormat(song.publishDate),
                    },
                    {
                      label: "BPM",
                      value: BpmFormat(data?.minMilliBpm, data?.maxMilliBpm),
                    },
                    {
                      label: "Language",
                      value: song.defaultNameLanguage,
                    },
                    {
                      label: "Status",
                      value: song.status,
                    },
                    {
                      label: "Favorites",
                      value: song.favoritedTimes,
                    },
                    {
                      label: "Score",
                      value: song.ratingScore,
                    },
                    {
                      label: "Hits",
                      value: data?.hits,
                    },
                    {
                      label: "Added on",
                      value: DateFormat(song.createDate),
                    },
                  ].map(({ label, value }) => (
                    <Col xs={12} sm={6} md={3} key={label}>
                      <div
                        style={{
                          background: darkMode ? "#1e1e32" : "#e8e8e8",
                          borderRadius: 14,
                          padding: "14px 16px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: mutedColor,
                            marginBottom: 4,
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: textColor,
                          }}
                        >
                          {value || "—"}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Producers */}
                {producers.length > 0 && (
                  <div className="mt-3">
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Producers
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {producers.map((a) => (
                        <Link
                          key={a.artist?.id}
                          to={`/artist/${a.artist?.id}`}
                          className="artist-link"
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: darkMode ? "#3a3a5e" : "#e0e0e0",
                            color: textColor,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {a.artist?.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocalists */}
                {vocalists.length > 0 && (
                  <div className="mt-3">
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Vocalists
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {vocalists.map((a) => (
                        <Link
                          key={a.artist?.id}
                          to={`/artist/${a.artist?.id}`}
                          className="artist-link"
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: darkMode ? "#3a3a5e" : "#e0e0e0",
                            color: textColor,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {a.artist?.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Artists */}
                {otherArtists.length > 0 && (
                  <div className="mt-3">
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Other Artists
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {otherArtists.map((a) => (
                        <Link
                          key={a.artist?.id}
                          to={`/artist/${a.artist?.id}`}
                          className="artist-link"
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: darkMode ? "#3a3a5e" : "#e0e0e0",
                            color: textColor,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {a.artist?.name} ({a.effectiveRoles})
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tags?.length > 0 && (
                  <div className="mt-3">
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Tags
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag?.id}
                          style={{
                            background: darkMode ? "#3a3a5e" : "#e0e0e0",
                            color: textColor,
                            fontWeight: 500,
                            fontSize: 12,
                            padding: "4px 12px",
                            borderRadius: 20,
                          }}
                        >
                          {tag?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Links */}
                {data?.pvs?.length > 0 && (
                  <div className="mt-3">
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      External Links
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {data.pvs.map((pv, idx) => (
                        <a
                          key={idx}
                          href={pv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 14px",
                            borderRadius: 20,
                            background: darkMode ? "#3a3a5e" : "#e0e0e0",
                            color: textColor,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {PlatformCode(pv.service)} {pv.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "download" && (
              <div>
                {loadingDownload ? (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ padding: 40 }}>
                    <div className={`spinner-border ${theme === "dark" ? "text-white" : "text-black"}`} role="status" style={{ width: 40, height: 40 }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span style={{ color: mutedColor, fontSize: 13, marginTop: 12 }}>Loading download options...</span>
                  </div>
                ) : downloadError || !youtubePv ? (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ padding: 40 }}>
                    <p style={{ color: mutedColor, fontSize: 14, marginBottom: 12 }}>
                      {downloadError || "No YouTube source found"}
                    </p>
                    {youtubePv && (
                      <button
                        onClick={() => window.open(youtubePv.url, "_blank")}
                        style={{
                          padding: "8px 20px",
                          borderRadius: 12,
                          background: "#5a8dee",
                          color: "#fff",
                          border: "none",
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Open YouTube
                      </button>
                    )}
                  </div>
                ) : downloadLinks ? (
                  <div className="d-flex flex-column gap-4">
                    {/* MP4 Section */}
                    {downloadLinks.mp4?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 13, color: mutedColor, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
                          Video (MP4)
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {downloadLinks.mp4.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => downloadFile(item.url)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "8px 18px",
                                borderRadius: 12,
                                background: darkMode ? "#2a2a3e" : "#d9d9d9",
                                color: textColor,
                                border: `1px solid ${borderColor}`,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#5a8dee";
                                e.currentTarget.style.color = "#fff";
                                e.currentTarget.style.borderColor = "#5a8dee";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = darkMode ? "#2a2a3e" : "#d9d9d9";
                                e.currentTarget.style.color = textColor;
                                e.currentTarget.style.borderColor = borderColor;
                              }}
                            >
                              <Download size={14} />
                              {item.quality || item.subname}p
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MP3 Section */}
                    {Object.values(downloadLinks.mp3).some(v => v !== null) && (
                      <div>
                        <div style={{ fontSize: 13, color: mutedColor, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
                          Audio (MP3)
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {[320, 256, 192].map((quality) => {
                            const streamPath = downloadLinks.mp3[quality];
                            if (!streamPath) return null;
                            return (
                              <button
                                key={quality}
                                onClick={() => downloadFile(`https://api-wh.savefrom.co.id${streamPath}`)}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  padding: "8px 18px",
                                  borderRadius: 12,
                                  background: darkMode ? "#2a2a3e" : "#d9d9d9",
                                  color: textColor,
                                  border: `1px solid ${borderColor}`,
                                  fontSize: 13,
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#5a8dee";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.borderColor = "#5a8dee";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = darkMode ? "#2a2a3e" : "#d9d9d9";
                                  e.currentTarget.style.color = textColor;
                                  e.currentTarget.style.borderColor = borderColor;
                                }}
                              >
                                <Download size={14} />
                                {quality}kbps
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Open Source Link */}
                    <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: 12 }}>
                      <a
                        href={youtubePv?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          color: "#5a8dee",
                          fontSize: 12,
                          textDecoration: "none",
                        }}
                      >
                        Open source <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: mutedColor, fontSize: 14, textAlign: "center", padding: 40 }}>
                    No downloadable sources available.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;
