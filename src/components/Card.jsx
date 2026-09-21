import React, { useState } from "react";
import { useTheme } from "../utils/ThemeProvider";
import { Link, useNavigate } from "react-router-dom";
import { Type } from "./Type";
import { Music, Heart } from "lucide-react";
import { Col, Row } from "react-bootstrap";

const Card = ({
  filtered
}) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(filtered[0])
  const [liked, setLiked] = useState([]);

  const cardBg = theme === 'light' ? "#2a2a3e" : "#d9d9d9";
  const textColor = theme === 'light' ? "#e0e0e0" : "#212529";
  const PALETTE = ["#b5c8e8", "#c8b5e8", "#b5e8c8", "#e8d5b5", "#e8b5b5", "#b5dce8", "#e8c8b5", "#d5b5e8"];
  
  return (
    // <Link
    //   className={`card ${className} bg-${theme === "dark" ? "dark" : "body-secondary"} text-${theme === "dark" ? "light" : "dark"}`}
    //   style={{ width: "18rem", cursor: "pointer", textDecoration: "none" }}
    //   to={`/song/${id}`}
    // >
    //   <img src={image} className="card-img-top" alt="..." />
    //   <div className="card-body">
    //     <h5 className="card-title">{title}</h5>
    //     <p className="card-text">{additionalNames}</p>
    //   </div>
    //   <ul className="list-group list-group-flush">
    //     <li
    //       className={`list-group-item bg-${theme === "dark" ? "black" : "light"} text-${theme === "dark" ? "light" : "dark"}`}
    //     >
    //       By: {artist}
    //     </li>
    //     <li
    //       className={`list-group-item bg-${theme === "dark" ? "black" : "light"} text-${theme === "dark" ? "light" : "dark"} d-flex align-items-center gap-2`}
    //     >
    //       <Type type={type} />
    //       {type}
    //     </li>
    //     <li
    //       className={`list-group-item bg-${theme === "dark" ? "black" : "light"} text-${theme === "dark" ? "light" : "dark"}`}
    //     >
    //       {date}
    //     </li>
    //   </ul>
    //   <div className="card-body"></div>
    // </Link>

    <div
              className={theme === 'light' ? "scroll-dark" : "scroll-light"}
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: 0,
                paddingRight: 2,
              }}
            >
              {filtered?.length === 0 ? (
                <div className="text-center py-5" style={{ color: "#888" }}>
                  No songs match your search.
                </div>
              ) : (
                <Row xs={2} sm={2} md={3} className="g-2 g-md-3 m-0">
                  {filtered?.map((song, i) => (
                    <Col key={song.id} className="p-1 p-md-2">
                      <Card
                        onClick={() => { setSelected(song); setShowPreview(true); }}
                        style={{
                          borderRadius: 18,
                          border: selected?.id === song.id
                            ? "2px solid #5a8dee"
                            : `1px solid ${theme === 'light' ? "#3a3a5e" : "#ccc"}`,
                          cursor: "pointer",
                          background: cardBg,
                          transition: "box-shadow 0.2s, border 0.2s",
                          boxShadow: selected?.id === song.id
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
  );
};

export default Card;
