import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Badge, Image } from "react-bootstrap";
import {
  Music,
  ListMusic,
  Disc,
  Heart,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { getDetailArtist } from "../services/artist.services";
import { useTheme } from "../utils/ThemeProvider";
import { DateFormat } from "../utils/DateFormat";
import { DurationFormat } from "../utils/DurationFormat";
import { LangCode } from "../utils/LangCode";
import { Description } from "../components/Description";
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

const ArtistDetail = () => {
  const { id } = useParams();
  const { theme } = useTheme();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const darkMode = theme === "dark";
  const cardBg = darkMode ? "#2a2a3e" : "#d9d9d9";
  const textColor = darkMode ? "#e0e0e0" : "#212529";
  const borderColor = darkMode ? "#3a3a5e" : "#ccc";
  const mutedColor = darkMode ? "#888" : "#666";
  const artColor = PALETTE[(data?.id || 0) % PALETTE.length];

  const isVocalist =
    data?.artistType === "Vocaloid" ||
    data?.artistType === "SynthesizerV" ||
    data?.artistType === "UTAU" ||
    data?.artistType === "VoiSona" ||
    data?.artistType === "CeVIO";

  const tags = data?.tags?.map((item) => item?.tag);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await getDetailArtist(id);
        if (!cancelled) setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

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
          <div
            className={`spinner-border ${theme === "dark" ? "text-white" : "text-black"}`}
            role="status"
            style={{ width: 50, height: 50 }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
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
          <p>Artist not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isBack={true}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "20px 20px 32px",
          minHeight: 0,
        }}
        className={darkMode ? "scroll-dark" : "scroll-light"}
      >
        {/* Top row: artist image + info */}
        <Row className="g-3 mb-3">
          {/* Artist image */}
          <Col xs={12} md={2}>
            <div
              style={{
                borderRadius: 24,
                border: `2px solid ${borderColor}`,
                background: artColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {data.mainPicture?.urlOriginal ? (
                <Image
                  fluid
                  src={data.mainPicture.urlOriginal}
                  alt={data.name}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              ) : (
                <Music size={80} color="rgba(0,0,0,0.18)" />
              )}
            </div>
          </Col>

          {/* Info Artist */}
          <Col xs={12} md={10}>
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
              <div>
                <h3
                  style={{
                    fontWeight: 800,
                    color: darkMode ? "#fff" : "#1a1a2e",
                    marginBottom: 4,
                    fontSize: "clamp(20px, 3vw, 32px)",
                  }}
                >
                  {data.name}
                </h3>
                <p
                  style={{
                    color: mutedColor,
                    fontSize: 15,
                    marginBottom: 10,
                  }}
                >
                  {data.additionalNames}
                </p>

                {/* Groups */}
                {data.groups?.length > 0 && (
                  <div className="mb-2">
                    <span style={{ fontSize: 12, color: mutedColor }}>
                      Groups:{" "}
                    </span>
                    {data.groups.map((g, i) => (
                      <span key={g.id}>
                        {i > 0 && ", "}
                        <Link
                          to={`/artist/${g.id}`}
                          className="artist-link"
                          style={{ color: textColor, fontSize: 14 }}
                        >
                          {g.name}
                        </Link>
                      </span>
                    ))}
                  </div>
                )}

                {/* Members */}
                {data.members?.length > 0 && (
                  <div className="mb-2">
                    <span style={{ fontSize: 12, color: mutedColor }}>
                      Members:{" "}
                    </span>
                    {data.members.map((m, i) => (
                      <span key={m.id}>
                        {i > 0 && ", "}
                        <Link
                          to={`/artist/${m.id}`}
                          className="artist-link"
                          style={{ color: textColor, fontSize: 14 }}
                        >
                          {m.name}
                        </Link>
                      </span>
                    ))}
                  </div>
                )}

                {/* Voice Providers */}
                {isVocalist && data.voiceProviders?.length > 0 && (
                  <div className="mb-2">
                    <span style={{ fontSize: 12, color: mutedColor }}>
                      Voice Provider:{" "}
                    </span>
                    {data.voiceProviders.map((vp, i) => (
                      <span key={vp.id}>
                        {i > 0 && ", "}
                        <Link
                          to={`/artist/${vp.id}`}
                          className="artist-link"
                          style={{ color: textColor, fontSize: 14 }}
                        >
                          {vp.defaultName}
                        </Link>
                      </span>
                    ))}
                  </div>
                )}

                {/* Illustrators */}
                {isVocalist && data.illustrators?.length > 0 && (
                  <div className="mb-2">
                    <span style={{ fontSize: 12, color: mutedColor }}>
                      Illustrated by:{" "}
                    </span>
                    {data.illustrators.map((il, i) => (
                      <span key={il.id}>
                        {i > 0 && ", "}
                        <Link
                          to={`/artist/${il.id}`}
                          className="artist-link"
                          style={{ color: textColor, fontSize: 14 }}
                        >
                          {il.defaultName}
                        </Link>
                      </span>
                    ))}
                  </div>
                )}

                {/* Language */}
                {data.cultureCodes?.length > 0 && (
                  <div className="mb-2">
                    <span style={{ fontSize: 12, color: mutedColor }}>
                      Language:{" "}
                    </span>
                    <span style={{ fontSize: 14, color: textColor }}>
                      {data.cultureCodes.map((c) => LangCode(c)).join(", ")}
                    </span>
                  </div>
                )}

                {/* Description */}
                {data.description?.original?.length > 0 && (
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: textColor,
                      marginTop: 8,
                    }}
                  >
                    <Description
                      des={
                        data.description.english?.length > 0
                          ? data.description.english
                          : data.description.original
                      }
                    />
                  </div>
                )}

                <div className="d-flex flex-wrap gap-2 mt-2">
                  {data.artistTypeTag && (
                    <Badge
                      style={{
                        background: artColor,
                        color: textColor,
                        fontWeight: 500,
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 20,
                      }}
                    >
                      {data.artistTypeTag.name}
                    </Badge>
                  )}
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
                    {data.artistType}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              {data.sharedStats && (
                <div className="d-flex flex-wrap gap-3 mt-3">
                  {[
                    {
                      icon: <Music size={14} />,
                      label: "Songs",
                      value: data.sharedStats.songCount,
                    },
                    {
                      icon: <Disc size={14} />,
                      label: "Albums",
                      value: data.sharedStats.albumCount,
                    },
                    {
                      icon: <Heart size={14} />,
                      label: "Followers",
                      value: data.sharedStats.followerCount,
                    },
                    {
                      icon: <BarChart3 size={14} />,
                      label: "Rated",
                      value: data.sharedStats.ratedSongCount,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: 13, color: mutedColor }}
                    >
                      {stat.icon}
                      <span style={{ fontWeight: 600, color: textColor }}>
                        {stat.value}
                      </span>
                      {stat.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Tabs panel */}
        <div
          style={{
            borderRadius: 24,
            border: `2px solid ${borderColor}`,
            background: cardBg,
            overflow: "hidden",
          }}
        >
          {/* Tab buttons */}
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
              { key: "songs", label: "Songs", icon: <ListMusic size={15} /> },
              { key: "albums", label: "Albums", icon: <Disc size={15} /> },
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
            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div>
                {/* Info grid */}
                <Row className="g-3">
                  {[
                    { label: "Name", value: data.name },
                    { label: "Type", value: data.artistType },
                    ...(isVocalist && data.releaseDate
                      ? [
                          {
                            label: "Release Date",
                            value: DateFormat(data.releaseDate),
                          },
                        ]
                      : []),
                    ...(data.cultureCodes?.length > 0
                      ? [
                          {
                            label: "Language",
                            value: data.cultureCodes
                              .map((c) => LangCode(c))
                              .join(", "),
                          },
                        ]
                      : []),
                    ...(data.status
                      ? [{ label: "Status", value: data.status }]
                      : []),
                    ...(data.createDate
                      ? [
                          {
                            label: "Added on",
                            value: DateFormat(data.createDate),
                          },
                        ]
                      : []),
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

                {/* Groups */}
                {data.groups?.length > 0 && (
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
                      Groups
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {data.groups.map((g) => (
                        <Link
                          key={g.id}
                          to={`/artist/${g.id}`}
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
                          {g.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Members */}
                {data.members?.length > 0 && (
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
                      Members
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {data.members.map((m) => (
                        <Link
                          key={m.id}
                          to={`/artist/${m.id}`}
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
                          {m.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Providers (for vocalists) */}
                {isVocalist && data.voiceProviders?.length > 0 && (
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
                      Voice Providers
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {data.voiceProviders.map((vp) => (
                        <Link
                          key={vp.id}
                          to={`/artist/${vp.id}`}
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
                          {vp.defaultName}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Illustrator (for vocalists) */}
                {isVocalist && data.illustrators?.length > 0 && (
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
                      Illustrated by
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {data.illustrators.map((il) => (
                        <Link
                          key={il.id}
                          to={`/artist/${il.id}`}
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
                          {il.defaultName}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Child Voicebanks (for vocalists) */}
                {isVocalist && data.childVoicebanks?.length > 0 && (
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
                      Voicebanks
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {data.childVoicebanks.map((vb) => (
                        <Link
                          key={vb.id}
                          to={`/artist/${vb.id}`}
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
                          {vb.name}
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
                {data.webLinks?.length > 0 && (
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
                      {data.webLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
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
                          <ExternalLink size={12} />
                          {link.description || link.url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SONGS TAB */}
            {activeTab === "songs" && (
              <div>
                {/* Latest Songs */}
                {data.latestSongs?.length > 0 && (
                  <div className="mb-4">
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 12,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Latest Songs
                    </div>
                    <Row xs={1} sm={2} md={3} className="g-2">
                      {data.latestSongs.map((song) => (
                        <Col key={song.id}>
                          <Link
                            to={`/song/${song.id}`}
                            style={{
                              display: "flex",
                              gap: 12,
                              padding: "10px 14px",
                              borderRadius: 14,
                              background: darkMode ? "#1e1e32" : "#e8e8e8",
                              color: textColor,
                              textDecoration: "none",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = darkMode
                                ? "#2a2a4a"
                                : "#ddd")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = darkMode
                                ? "#1e1e32"
                                : "#e8e8e8")
                            }
                          >
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                overflow: "hidden",
                                flexShrink: 0,
                                background: PALETTE[song.id % PALETTE.length],
                              }}
                            >
                              {song.mainPicture?.urlOriginal && (
                                <img
                                  src={song.mainPicture.urlOriginal}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {song.defaultName}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: mutedColor,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {DurationFormat(song.lengthSeconds)} ·{" "}
                                {song.songType}
                              </div>
                            </div>
                          </Link>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Top Songs */}
                {data.topSongs?.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 12,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Top Songs
                    </div>
                    <Row xs={1} sm={2} md={3} className="g-2">
                      {data.topSongs.map((song) => (
                        <Col key={song.id}>
                          <Link
                            to={`/song/${song.id}`}
                            style={{
                              display: "flex",
                              gap: 12,
                              padding: "10px 14px",
                              borderRadius: 14,
                              background: darkMode ? "#1e1e32" : "#e8e8e8",
                              color: textColor,
                              textDecoration: "none",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = darkMode
                                ? "#2a2a4a"
                                : "#ddd")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = darkMode
                                ? "#1e1e32"
                                : "#e8e8e8")
                            }
                          >
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                overflow: "hidden",
                                flexShrink: 0,
                                background: PALETTE[song.id % PALETTE.length],
                              }}
                            >
                              {song.mainPicture?.urlOriginal && (
                                <img
                                  src={song.mainPicture.urlOriginal}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {song.defaultName}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: mutedColor,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {song.ratingScore} pts ·{" "}
                                {DurationFormat(song.lengthSeconds)}
                              </div>
                            </div>
                          </Link>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </div>
            )}

            {/* ALBUMS TAB */}
            {activeTab === "albums" && (
              <div>
                {/* Latest Albums */}
                {data.latestAlbums?.length > 0 && (
                  <div className="mb-4">
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 12,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Latest Albums
                    </div>
                    <Row xs={1} sm={2} md={3} className="g-2">
                      {data.latestAlbums.map((album) => (
                        <Col key={album.id}>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              padding: "10px 14px",
                              borderRadius: 14,
                              background: darkMode ? "#1e1e32" : "#e8e8e8",
                            }}
                          >
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                overflow: "hidden",
                                flexShrink: 0,
                                background: PALETTE[album.id % PALETTE.length],
                              }}
                            >
                              {album.mainPicture?.urlOriginal && (
                                <img
                                  src={album.mainPicture.urlOriginal}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: textColor,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {album.defaultName}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: mutedColor,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {album.discType} ·{" "}
                                {album.releaseDate?.year || "—"}
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Top Albums */}
                {data.topAlbums?.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: mutedColor,
                        marginBottom: 12,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Top Albums
                    </div>
                    <Row xs={1} sm={2} md={3} className="g-2">
                      {data.topAlbums.map((album) => (
                        <Col key={album.id}>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              padding: "10px 14px",
                              borderRadius: 14,
                              background: darkMode ? "#1e1e32" : "#e8e8e8",
                            }}
                          >
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                overflow: "hidden",
                                flexShrink: 0,
                                background: PALETTE[album.id % PALETTE.length],
                              }}
                            >
                              {album.mainPicture?.urlOriginal && (
                                <img
                                  src={album.mainPicture.urlOriginal}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: textColor,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {album.defaultName}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: mutedColor,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {album.ratingAverage > 0
                                  ? `★ ${album.ratingAverage.toFixed(1)}`
                                  : ""}{" "}
                                · {album.discType}
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
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

export default ArtistDetail;
