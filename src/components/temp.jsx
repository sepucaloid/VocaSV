import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import {
  Navbar,
  Nav,
  Form,
  InputGroup,
  Dropdown,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { Search, Music, Play, Heart, MoreHorizontal } from "lucide-react";

const SONG_TYPES = ["All Types", "Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "Electronic"];
const ARTISTS = ["All Artists", "Artist A", "Artist B", "Artist C", "Artist D"];

const SONGS = [
  { id: 1, title: "Midnight Echo", artist: "Artist A", type: "Pop", duration: "3:42" },
  { id: 2, title: "Blue Horizon", artist: "Artist B", type: "Jazz", duration: "4:15" },
  { id: 3, title: "Static Dreams", artist: "Artist C", type: "Electronic", duration: "5:01" },
  { id: 4, title: "Golden Hour", artist: "Artist D", type: "Pop", duration: "3:28" },
  { id: 5, title: "Fading Light", artist: "Artist A", type: "Rock", duration: "4:50" },
  { id: 6, title: "River Song", artist: "Artist B", type: "Classical", duration: "6:12" },
  { id: 7, title: "Neon Pulse", artist: "Artist C", type: "Electronic", duration: "4:05" },
  { id: 8, title: "Velvet Road", artist: "Artist D", type: "Jazz", duration: "5:33" },
];

const PALETTE = ["#b5c8e8", "#c8b5e8", "#b5e8c8", "#e8d5b5", "#e8b5b5", "#b5dce8", "#e8c8b5", "#d5b5e8"];

export default function App() {
  const [search, setSearch] = useState("");
  const [songType, setSongType] = useState("All Types");
  const [artist, setArtist] = useState("All Artists");
  const [selected, setSelected] = useState(SONGS[0]);
  const [liked, setLiked] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const bg = darkMode ? "#1a1a2e" : "#f0f2f5";
  const cardBg = darkMode ? "#2a2a3e" : "#d9d9d9";
  const textColor = darkMode ? "#e0e0e0" : "#212529";

  const filtered = SONGS.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q);
    const matchesType = songType === "All Types" || s.type === songType;
    const matchesArtist = artist === "All Artists" || s.artist === artist;
    return matchesSearch && matchesType && matchesArtist;
  });

  const toggleLike = (id) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const selectedIndex = SONGS.findIndex((s) => s.id === selected.id);

  const PreviewPanel = () => (
    <Card
      style={{
        borderRadius: 24,
        border: `2px solid ${darkMode ? "#3a3a5e" : "#ccc"}`,
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
        <Music size={80} color="rgba(0,0,0,0.2)" />
      </div>

      <Card.Body className="p-3 p-md-4 d-flex flex-column" style={{ overflowY: "auto" }}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div style={{ minWidth: 0, flex: 1, paddingRight: 8 }}>
            <h5
              className="mb-1"
              style={{
                fontWeight: 700,
                color: darkMode ? "#e0e0e0" : "#1a1a2e",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selected.title}
            </h5>
            <p style={{ color: "#777", fontSize: 13, marginBottom: 0 }}>
              {selected.artist} · {selected.type}
            </p>
          </div>
          <div className="d-flex gap-2 align-items-center flex-shrink-0">
            <button
              onClick={() => toggleLike(selected.id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <Heart
                size={18}
                fill={liked.includes(selected.id) ? "#ee0055" : "none"}
                color={liked.includes(selected.id) ? "#ee0055" : "#999"}
              />
            </button>
            <MoreHorizontal size={18} color="#999" style={{ cursor: "pointer" }} />
          </div>
        </div>

        <div className="mb-3">
          <div style={{ height: 4, borderRadius: 2, background: darkMode ? "#444" : "#bbb", overflow: "hidden" }}>
            <div style={{ width: "38%", height: "100%", background: "#5a8dee", borderRadius: 2 }} />
          </div>
          <div className="d-flex justify-content-between mt-1">
            <span style={{ fontSize: 11, color: "#999" }}>1:26</span>
            <span style={{ fontSize: 11, color: "#999" }}>{selected.duration}</span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center gap-3 mt-auto">
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ borderRadius: 50, width: 36, height: 36, padding: 0 }}
          >
            ⏮
          </Button>
          <Button
            size="lg"
            style={{
              borderRadius: 50, width: 50, height: 50, padding: 0,
              background: "#1a1a2e", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Play size={20} fill="#fff" color="#fff" />
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ borderRadius: 50, width: 36, height: 36, padding: 0 }}
          >
            ⏭
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: bg,
        color: textColor,
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {/* Navbar */}
      <Navbar
        expand="lg"
        style={{ background: darkMode ? "#0f0f1a" : "#1a1a2e", flexShrink: 0 }}
        className="px-3 py-2 shadow"
      >
        <Navbar.Brand href="#" className="fw-bold fs-5" style={{ color: "#fff", letterSpacing: 1 }}>
          VocaSV
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" style={{ borderColor: "#555" }} />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link href="#" style={{ color: "#fff", fontWeight: 500 }}>Home</Nav.Link>
            <Nav.Link href="#" style={{ color: "#aaa" }}>Album</Nav.Link>
            <Nav.Link href="#" style={{ color: "#aaa" }}>Artist</Nav.Link>
            <Button
              size="sm"
              variant="outline-light"
              onClick={() => setDarkMode((d) => !d)}
              style={{ borderRadius: 20, fontSize: 13, padding: "4px 14px" }}
            >
              {darkMode ? "☀ Dark" : "💡 Light"}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", minHeight: 0 }}>
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
                  background: darkMode ? "#2a2a3e" : "#fff",
                  border: "1px solid #ccc",
                  borderRight: "none",
                  borderRadius: "50px 0 0 50px",
                }}
              >
                <Search size={16} color="#949494" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  borderLeft: "none",
                  borderRight: search ? "none" : "1px solid #ccc",
                  borderRadius: search ? 0 : "0 50px 50px 0",
                  background: darkMode ? "#2a2a3e" : "#fff",
                  color: textColor,
                  fontSize: 16,
                }}
              />
              {search && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearch("")}
                  style={{ borderRadius: "0 50px 50px 0", border: "1px solid #ccc", fontSize: 12 }}
                >
                  ✕
                </Button>
              )}
            </InputGroup>

            {/* Filters */}
            <div className="d-flex flex-wrap gap-2 mb-3" style={{ flexShrink: 0 }}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  style={{
                    borderRadius: 15, border: "1px solid #ccc",
                    background: cardBg, color: textColor,
                    fontSize: 13, padding: "5px 14px",
                  }}
                >
                  {songType === "All Types" ? "Song Type 🔽" : `${songType} 🔽`}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {SONG_TYPES.map((t) => (
                    <Dropdown.Item key={t} onClick={() => setSongType(t)} active={songType === t}>
                      {t}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  style={{
                    borderRadius: 15, border: "1px solid #ccc",
                    background: cardBg, color: textColor,
                    fontSize: 13, padding: "5px 14px",
                  }}
                >
                  {artist === "All Artists" ? "Artist 🔽" : `${artist} 🔽`}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {ARTISTS.map((a) => (
                    <Dropdown.Item key={a} onClick={() => setArtist(a)} active={artist === a}>
                      {a}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {(songType !== "All Types" || artist !== "All Artists") && (
                <Button
                  variant="link"
                  size="sm"
                  style={{ fontSize: 12, color: "#888", textDecoration: "none" }}
                  onClick={() => { setSongType("All Types"); setArtist("All Artists"); }}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Scrollable card grid */}
            <div
              className={darkMode ? "scroll-dark" : "scroll-light"}
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: 0,
                paddingRight: 2,
              }}
            >
              {filtered.length === 0 ? (
                <div className="text-center py-5" style={{ color: "#888" }}>
                  No songs match your search.
                </div>
              ) : (
                <Row xs={2} sm={2} md={3} className="g-2 g-md-3 m-0">
                  {filtered.map((song, i) => (
                    <Col key={song.id} className="p-1 p-md-2">
                      <Card
                        onClick={() => { setSelected(song); setShowPreview(true); }}
                        style={{
                          borderRadius: 18,
                          border: selected.id === song.id
                            ? "2px solid #5a8dee"
                            : `1px solid ${darkMode ? "#3a3a5e" : "#ccc"}`,
                          cursor: "pointer",
                          background: cardBg,
                          transition: "box-shadow 0.2s, border 0.2s",
                          boxShadow: selected.id === song.id
                            ? "0 0 0 3px rgba(90,141,238,0.2)"
                            : "none",
                        }}
                        className="h-100"
                      >
                        <div
                          style={{
                            height: "clamp(80px, 12vw, 130px)",
                            borderRadius: "16px 16px 0 0",
                            background: PALETTE[i % PALETTE.length],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Music size={32} color="rgba(0,0,0,0.25)" />
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
                            {song.title}
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
                            {song.artist} · {song.type}
                          </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <span style={{ fontSize: 11, color: "#999" }}>{song.duration}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                            >
                              <Heart
                                size={13}
                                fill={liked.includes(song.id) ? "#ee0055" : "none"}
                                color={liked.includes(song.id) ? "#ee0055" : "#999"}
                              />
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </div>

          {/* Right column — preview panel, visible on md+ */}
          <div
            className="d-none d-md-flex flex-column"
            style={{ flex: "0 0 340px", minWidth: 0, minHeight: 0 }}
          >
            <PreviewPanel />
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {showPreview && (
        <div
          className="d-md-none"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1040,
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={() => setShowPreview(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxHeight: "80vh",
              background: cardBg,
              borderRadius: "20px 20px 0 0",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "12px 0 4px",
                display: "flex",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#999" }} />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <PreviewPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
