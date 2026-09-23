import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { GetAllSongs, getType } from "../services/song.services";
import { useDebounce } from "../utils/useDebounce";
import { useTheme } from "../utils/ThemeProvider";
import { useAudioPlayer } from "../utils/AudioPlayerContext";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import {
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { DurationFormat } from "../utils/DurationFormat";
import { Link } from "react-router-dom";

const Home = () => {
  const { theme } = useTheme();
  const { play, currentSong, isPlaying, playedSeconds, duration, seek } =
    useAudioPlayer();

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pages, setPages] = useState(0);
  const [songType, setSongType] = useState("All Types");
  const [sortBy, setSortBy] = useState("AdditionDate");
  const [urlType, setUrlType] = useState("");

  const [typeData, setTypeData] = useState([
    {
      id: -1,
      name: "All Types",
      slug: "",
    },
  ]);

  const sortList = [
    {
      id: 1,
      name: "Addition date",
      value: "AdditionDate",
    },
    {
      id: 2,
      name: "Publish date",
      value: "PublishDate",
    },
    {
      id: 3,
      name: "Rating score (The most Famous Vocaloid's Songs)",
      value: "RatingScore",
    },
    {
      id: 4,
      name: "Name",
      value: "Name",
    },
    {
      id: 5,
      name: "Times favorited",
      value: "FavoritedTimes",
    },
    {
      id: 6,
      name: "Tag usage count",
      value: "TagUsageCount",
    },
  ];

  const cardBg = theme === "dark" ? "#2a2a3e" : "#d9d9d9";
  const textColor = theme === "dark" ? "#e0e0e0" : "#212529";
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

  const [selected, setSelected] = useState(null);
  const [liked, setLiked] = useState([]);

  const toggleLike = (id) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const [input, setInput] = useState("");
  const debounceValue = useDebounce(input, 600);

  const observerRef = useRef(null);

  const fetchData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await GetAllSongs(pages, debounceValue, urlType, sortBy);
      if (res.length === 0) {
        setHasMore(false);
      } else {
        setSongs((prev) => [
          ...new Map([...prev, ...res].map((item) => [item.id, item])).values(),
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchType = async () => {
      try {
        const res = await getType();
        if (res?.data?.length > 0) {
          setTypeData((prev) => [
            ...new Map(
              [...prev, ...res.data].map((item) => [item.id, item]),
            ).values(),
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchType();
  }, []);

  useEffect(() => {
    if (songs.length > 0 && !selected) {
      setSelected(songs[0]);
    }
  }, [songs, selected]);

  useEffect(() => {
    setPages(0);
    setSongs([]);
    setHasMore(true);
  }, [debounceValue, urlType, sortBy]);

  useEffect(() => {
    let ignore = false;

    const doFetch = async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const res = await GetAllSongs(pages, debounceValue, urlType, sortBy);
        if (!ignore) {
          if (res.length === 0) {
            setHasMore(false);
          } else {
            setSongs((prev) => [
              ...new Map([...prev, ...res].map((item) => [item.id, item])).values(),
            ]);
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    doFetch();
    return () => {
      ignore = true;
    };
  }, [pages, debounceValue, urlType, sortBy]);

  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPages((prev) => prev + 20);
        }
      },
      {
        threshold: 0.5,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore]);

  const selectedIndex = songs.findIndex((s) => s.id === selected?.id);

  const previewProgress = duration > 0 ? (playedSeconds / duration) * 100 : 0;

  const handlePrev = () => {
    if (songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === selected?.id);
    const prevIdx = idx <= 0 ? songs.length - 1 : idx - 1;
    setSelected(songs[prevIdx]);
  };

  const handleNext = () => {
    if (songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === selected?.id);
    const nextIdx = idx >= songs.length - 1 ? 0 : idx + 1;
    setSelected(songs[nextIdx]);
  };

  return (
    <Layout>
      {/* Main content */}
      <div
        style={{ flex: 1, overflow: "hidden", display: "flex", minHeight: 0 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "16px",
            gap: 16,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Left column */}
          <div
            style={{
              flex: "1 1 0",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Search */}
            <InputGroup className="mb-2 shadow-sm" style={{ flexShrink: 0 }}>
              <InputGroup.Text
                style={{
                  background: theme === "dark" ? "#2a2a3e" : "#fff",
                  border: "1px solid #ccc",
                  borderRight: "none",
                  borderRadius: "50px 0 0 50px",
                }}
              >
                <Search
                  size={16}
                  color={theme === "light" ? "#949494" : "white"}
                />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="search"
                style={{
                  border: "1px solid #ccc",
                  borderLeft: "none",
                  borderRight: input ? "none" : "1px solid #ccc",
                  borderRadius: input ? 0 : "0 50px 50px 0",
                  background: theme === "dark" ? "#2a2a3e" : "#fff",
                  color: textColor,
                  fontSize: 16,
                }}
              />
              {input && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setInput("")}
                  style={{
                    borderRadius: "0 50px 50px 0",
                    border: "1px solid #ccc",
                    fontSize: 12,
                  }}
                >
                  ✕
                </Button>
              )}
            </InputGroup>

            {/* Filters */}
            <div
              className="d-flex flex-wrap gap-2 mb-3"
              style={{ flexShrink: 0 }}
            >
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  style={{
                    borderRadius: 15,
                    border: "1px solid #ccc",
                    background: cardBg,
                    color: textColor,
                    fontSize: 13,
                    padding: "5px 14px",
                  }}
                >
                  {songType === "All Types" ? "Song Type " : `${songType} `}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {typeData?.map((t) => (
                    <Dropdown.Item
                      key={t.id}
                      onClick={() => {
                        setSongType(t.name);
                        setUrlType(t.id === -1 ? "" : `tagId%5B%5D=${t.id}&`);
                      }}
                      active={songType === t.name}
                    >
                      {t.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  style={{
                    borderRadius: 15,
                    border: "1px solid #ccc",
                    background: cardBg,
                    color: textColor,
                    fontSize: 13,
                    padding: "5px 14px",
                  }}
                >
                  {sortBy === "RatingScore"
                    ? "Rating score"
                    : sortList?.find((t) => t.value === sortBy).name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {sortList?.map((t) => (
                    <Dropdown.Item
                      key={t.id}
                      onClick={() => {
                        setSortBy(t.value);
                      }}
                      active={songType === t.name}
                    >
                      {t.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {/* {(songType !== "All Types" || artist !== "All Artists") && (
                <Button
                  variant="link"
                  size="sm"
                  style={{ fontSize: 12, color: "#888", textDecoration: "none" }}
                  onClick={() => { setSongType("All Types"); setArtist("All Artists"); }}
                >
                  Clear
                </Button>
              )} */}
            </div>

            {/* Scrollable card grid */}
            <div
              className={theme === "light" ? "scroll-dark" : "scroll-light"}
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: 6,
                paddingBottom: 70,
              }}
            >
              {songs.length === 0 && !hasMore ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    height: 100,
                    width: "100%",
                  }}
                >
                  <div className="text-center py-5" style={{ color: "#888" }}>
                    No songs match your search.
                  </div>
                </div>
              ) : (
                <>
                  <Row xs={2} sm={2} md={4} className="g-2 g-md-3 m-0">
                    {songs.map((item, i) => (
                      <Col key={item.id} className="p-1 p-md-2">
                        <Card
                          onClick={() => {
                            setSelected(item);
                          }}
                          className="h-100"
                          style={{
                            borderRadius: 18,
                            border:
                              selected?.id === item.id
                                ? "2px solid #5a8dee"
                                : `1px solid ${
                                    theme === "light" ? "#3a3a5e" : "#ccc"
                                  }`,
                            cursor: "pointer",
                            background: cardBg,
                            transition: "box-shadow 0.2s, border 0.2s",
                            boxShadow:
                              selected?.id === item.id
                                ? "0 0 0 3px rgba(90,141,238,0.2)"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              height: "clamp(100px, 12vw, 160px)",
                              borderRadius: "16px 16px 0 0",
                              background: PALETTE[i % PALETTE.length],
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              fluid
                              src={item.mainPicture?.urlOriginal}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                          <Card.Body className="p-2">
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: textColor,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: 2,
                              }}
                            >
                              <Link
                                to={`/song/${item.id}`}
                                className="d-flex link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                                style={{
                                  color: textColor,
                                }}
                              >
                                <div className="me-auto">
                                  {item.defaultName}
                                </div>
                                <div
                                  className={
                                    theme === "light"
                                      ? "text-info"
                                      : "text-primary"
                                  }
                                >
                                  More details..
                                </div>
                              </Link>
                            </div>

                            <div
                              style={{
                                fontSize: 11,
                                color: "#888",
                                marginBottom: 6,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.artistString?.split(" feat.")[0]} ·{" "}
                              {item.songType}
                            </div>

                            <div className="d-flex align-items-center justify-content-between">
                              <span style={{ fontSize: 11, color: "#999" }}>
                                {DurationFormat(item.lengthSeconds)}
                              </span>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLike(item.id);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                }}
                              >
                                <Heart
                                  size={13}
                                  fill={
                                    liked.includes(item.id) ? "#ee0055" : "none"
                                  }
                                  color={
                                    liked.includes(item.id) ? "#ee0055" : "#999"
                                  }
                                />
                              </button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Observer berada DI LUAR Row */}
                  {hasMore && (
                    <div
                      ref={observerRef}
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "300px",
                        width: "100%",
                      }}
                    >
                      {loading && (
                        <div
                          className={`spinner-border ${theme === "dark" ? "text-white" : "text-black"}`}
                          role="status"
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right column — preview panel, visible on md+ */}
          <div
            className="d-none d-md-flex flex-column"
            style={{ flex: "0 0 340px", minWidth: 0, minHeight: 0 }}
          >
            <Card
              style={{
                borderRadius: 24,
                border: `2px solid ${theme === "light" ? "#3a3a5e" : "#ccc"}`,
                background: cardBg,
                overflow: "hidden",
                height: "100%",
              }}
              className="shadow-sm"
            >
              <div
                style={{
                  height: "clamp(160px, 30vh, 280px)",
                  background: PALETTE[selectedIndex % PALETTE.length],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  fluid
                  src={selected?.mainPicture?.urlOriginal}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <Card.Body
                className="p-3 p-md-4 d-flex flex-column"
                style={{ overflowY: "auto" }}
              >
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div style={{ minWidth: 0, flex: 1, paddingRight: 8 }}>
                    <Link
                      to={`/song/${selected?.id}`}
                      className="mb-1 fs-5 link-underline link-underline-opacity-25 link-underline-opacity-75-hover link-offset-2"
                      style={{
                        fontWeight: 700,
                        color: theme === "dark" ? "#e0e0e0" : "#1a1a2e",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selected?.defaultName}
                    </Link>
                    <p style={{ color: "#777", fontSize: 13, marginBottom: 0 }}>
                      {selected?.artistString?.split(" feat.")[0]} ·{" "}
                      {selected?.songType}
                    </p>
                  </div>
                  <div className="d-flex gap-2 align-items-center flex-shrink-0">
                    <button
                      onClick={() => toggleLike(selected?.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <Heart
                        size={18}
                        fill={liked.includes(selected?.id) ? "#ee0055" : "none"}
                        color={
                          liked.includes(selected?.id) ? "#ee0055" : "#999"
                        }
                      />
                    </button>
                    <MoreHorizontal
                      size={18}
                      color="#999"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>

                {/* Synced progress bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={previewProgress}
                    onChange={(e) => seek(Number(e.target.value) / 100)}
                    style={{
                      width: "100%",
                      height: 4,
                      accentColor: "#5a8dee",
                      cursor: "pointer",
                    }}
                  />
                  <div className="d-flex justify-content-between mt-1">
                    <span style={{ fontSize: 11, color: "#999" }}>
                      {DurationFormat(Math.round(playedSeconds))}
                    </span>
                    <span style={{ fontSize: 11, color: "#999" }}>
                      {DurationFormat(selected?.lengthSeconds)}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center gap-3 mt-auto">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handlePrev}
                    style={{
                      borderRadius: 50,
                      width: 36,
                      height: 36,
                      padding: 0,
                    }}
                  >
                    <SkipBack size={16} />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => play(selected)}
                    style={{
                      borderRadius: 50,
                      width: 50,
                      height: 50,
                      padding: 0,
                      background: theme === "dark" ? "#5a8dee" : "#1a1a2e",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {currentSong?.id === selected?.id && isPlaying ? (
                      <Pause size={20} fill="#fff" color="#fff" />
                    ) : (
                      <Play size={20} fill="#fff" color="#fff" />
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleNext}
                    style={{
                      borderRadius: 50,
                      width: 36,
                      height: 36,
                      padding: 0,
                    }}
                  >
                    <SkipForward size={16} />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
