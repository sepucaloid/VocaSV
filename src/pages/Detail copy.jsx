import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link, useParams } from "react-router-dom";
import { getDetail, getLyric } from "../services/song.services";
import { useTheme } from "../utils/ThemeProvider";
import { Type } from "../components/Type";
import { TypeVocal } from "../components/TypeVocal";
import { DurationFormat } from "../utils/DurationFormat";
import { Col, Row } from "react-bootstrap";
import { BpmFormat } from "../utils/BpmFormat";
import { DateFormat } from "../utils/DateFormat";
import { LangCode } from "../utils/LangCode";
import { PlatformCode } from "../components/PlatformCode";
import { TagsSort } from "../components/TagsSort";

const Detail = () => {
  const { theme } = useTheme();

  const { id } = useParams();

  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const otherArtists = data?.artists?.find(
    (item) =>
      item.categories?.includes("Illustrator") ||
      item.categories?.includes("Animator") ||
      item.categories === "Circle" ||
      item.categories === "Other",
  );

  const tags = data?.tags?.map((item) => item?.tag);

  const [activeIndex, setActiveIndex] = useState(0);
  const [idLyric, setIdLyric] = useState(null);
  const [lyric, setLyric] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getDetail(id);
      console.log(res.data);
      setData(res.data);
    } catch (e) {
      console.error(e.response);
    } finally {
      setLoading(false);
      setShow(true);
    }
  };

  const fetchLyric = async () => {
    try {
      const res = await getLyric(idLyric);
      setLyric(res);
    } catch (e) {
      console.error(e.response);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();
  }, [id]);

  useEffect(() => {
    if (data?.lyricsFromParents?.length > 0) {
      setIdLyric(data?.lyricsFromParents[0]?.id);
    }
  }, [data]);

  useEffect(() => {
    if (idLyric) {
      fetchLyric();
    }
  }, [idLyric]);

  return (
    <Layout isBack={true}>
      {show ? (
        // Title Song
        <div className="d-flex pt-5 justify-content-center flex-column gap-3">
          {/* Title */}
          <div
            className={`head border-${theme === "dark" ? "light" : "dark"} d-flex flex-column h-50 justify-content-center align-items-center`}
          >
            <img
              src={data?.song?.mainPicture?.urlOriginal}
              alt=""
              className="img-fluid px-5"
            />
            <h5>
              {data?.song?.status === "Approved" ? "✔ Approved" : "⭐ Finished"}
            </h5>
            <br />
            <div
              className={`w-100 px-3 d-flex flex-column text-center border-top bg-${theme === "dark" ? "dark" : "body-secondary"} border-bottom border-${theme === "dark" ? "light" : "dark"}`}
            >
              <span>Name:</span>
              <h1>{data?.song?.defaultName}</h1>
              <h6>{data?.additionalNames}</h6>
            </div>
          </div>

          {/* Artists */}
          <div
            className={`w-100 d-flex px-3 flex-column text-center border-top bg-${theme === "dark" ? "dark" : "body-secondary"} border-bottom border-${theme === "dark" ? "light" : "dark"}`}
          >
            <h3
              className={`border-bottom pb-3 pt-2 border-${theme === "dark" ? "light" : "dark"}`}
            >
              Vocalists:{" "}
              {data?.artists
                ?.filter((item) => item.categories === "Vocalist")
                .map((artist) => (
                  <div
                    key={artist.artist?.name}
                    className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-lg-2 mb-2"
                  >
                    <div className="d-flex gap-2 justify-content-center align-items-center">
                      <TypeVocal type={artist.artist?.artistType} />
                      <Link
                        to={`/artist/${artist.artist?.id}`}
                        className="fs-4"
                      >
                        {artist.artist?.name}
                      </Link>
                    </div>
                    <span className="fs-5">
                      {" "}
                      ({artist.artist?.additionalNames})
                    </span>
                  </div>
                ))}
            </h3>
            <h3
              className={`${otherArtists ? "border-bottom" : ""} pb-3 border-${theme === "dark" ? "light" : "dark"}`}
            >
              Producers:{" "}
              {data?.artists
                ?.filter((item) => item.categories?.includes("Producer"))
                .map((artist) => (
                  <div
                    key={artist.artist?.name}
                    className="d-flex justify-content-center align-items-center flex-column flex-lg-row gap-lg-2"
                  >
                    <Link to={`/artist/${artist.artist?.id}`} className="fs-4">
                      {artist.artist?.name}
                    </Link>
                    {artist.artist.additionalNames && (
                      <span className="fs-5">
                        {" "}
                        ({artist.artist?.additionalNames})
                      </span>
                    )}
                  </div>
                ))}
            </h3>

            {otherArtists && (
              <h3 className={`pb-3`}>
                Other artists:{" "}
                <div className="container">
                  <div className="row row-cols-auto justify-content-center">
                    {data?.artists
                      ?.filter(
                        (item) =>
                          item.categories?.includes("Illustrator") ||
                          item.categories?.includes("Animator") ||
                          item.categories === "Circle" ||
                          item.categories === "Other",
                      )
                      .map((artist) => (
                        <div key={artist.artist?.name} className="col">
                          <Link
                            to={`/artist/${artist.artist?.id}`}
                            className="fs-4"
                          >
                            {artist.artist?.name}
                          </Link>
                          {artist.effectiveRoles && (
                            <span className="fs-5">
                              {" "}
                              ({artist.effectiveRoles})
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </h3>
            )}
          </div>

          {/* Song details */}
          <div
            className={`w-100 d-flex flex-column justify-content-center align-items-center py-3 border-top bg-${theme === "dark" ? "dark" : "body-secondary"} border-bottom border-${theme === "dark" ? "light" : "dark"}`}
          >
            <h3>Details:</h3>
            <div className="d-none d-lg-grid container px-0 fs-5">
              {/* Computer view */}
              {/* Publish date */}
              <Row className="py-1 d-flex justify-content-center ms-5">
                <Col xs={2} className="fw-semibold">
                  Published:
                </Col>
                <Col xs={2} className="d-flex gap-2">
                  {DateFormat(data?.song?.publishDate)}
                </Col>
              </Row>
              {/* Type song */}
              <Row className="py-1 d-flex justify-content-center ms-5">
                <Col xs={2} className="fw-semibold">
                  Type:
                </Col>
                <Col xs={2} className="d-flex gap-2">
                  <Type type={data?.song?.songType} />{" "}
                  {data?.songTypeTag?.name?.charAt(0).toUpperCase()}
                  {data?.songTypeTag?.name?.slice(1).toLowerCase()}
                </Col>
              </Row>
              {/* Song duration */}
              <Row className="py-1 justify-content-center ms-5">
                <Col xs={2} className="fw-semibold">
                  Duration:
                </Col>
                <Col xs={2} className="d-flex gap-2">
                  {DurationFormat(data?.song?.lengthSeconds)}
                </Col>
              </Row>
              {/* Song Lang */}
              <Row className="py-1 justify-content-center ms-5">
                <Col xs={2} className="fw-semibold">
                  Language(s):
                </Col>
                <Col xs={2} className="d-flex gap-2">
                  {data?.song?.defaultNameLanguage}
                </Col>
              </Row>
              {/* Song BPM */}
              <Row className="py-1 justify-content-center ms-5">
                <Col xs={2} className="fw-semibold">
                  BPM:
                </Col>
                <Col xs={2} className="d-flex gap-2">
                  {BpmFormat(data?.minMilliBpm, data?.maxMilliBpm)}
                </Col>
              </Row>
            </div>

            {/* Mobile view */}
            {/* Publish Date */}
            <div className="d-flex d-lg-none flex-column fs-5 text-center gap-2">
              <div className="">
                <h5 className="fw-semibold">Published:</h5>
                <div className="d-flex gap-2">
                  {DateFormat(data?.song?.publishDate)}
                </div>
              </div>

              {/* Type song */}
              <div className="">
                <h5 className="fw-semibold">Type:</h5>
                <div className="d-flex gap-2 justify-content-center">
                  <Type type={data?.song?.songType} />{" "}
                  {data?.songTypeTag?.name?.charAt(0).toUpperCase()}
                  {data?.songTypeTag?.name?.slice(1).toLowerCase()}
                </div>
              </div>

              {/* Song duration */}
              <div className="">
                <h5 className="fw-semibold">Duration:</h5>
                <div className="d-flex justify-content-center">
                  {DurationFormat(data?.song?.lengthSeconds)}
                </div>
              </div>

              {/* Song Lang */}
              <div className="">
                <h5 className="fw-semibold">Language(s):</h5>
                <div className="d-flex justify-content-center">
                  {data?.song?.defaultNameLanguage}
                </div>
              </div>
              {/* Song BPM */}
              <div className="">
                <h5 className="fw-semibold">BPM:</h5>
                <div className="d-flex justify-content-center">
                  {BpmFormat(data?.minMilliBpm, data?.maxMilliBpm)}
                </div>
              </div>
            </div>
          </div>

          {/* Tags song */}
          <div
            className={`w-100 d-flex justify-content-center flex-column align-items-center py-3 border-top bg-${theme === "dark" ? "dark" : "body-secondary"} border-bottom border-${theme === "dark" ? "light" : "dark"}`}
          >
            <h3>Tags:</h3>
            <div className="d-flex flex-column d-lg-grid container-lg px-0 fs-5 justify-content-center gap-2">
              {/* Computer view */}
              {/* Genre Song */}
              {tags && <TagsSort data={tags} />}
            </div>
          </div>

          {/* Lyrics Song */}
          {data?.lyricsFromParents && (
            <div
              className={`w-100 d-flex justify-content-center flex-column align-items-center py-3 border-top bg-${theme === "dark" ? "dark" : "body-secondary"} border-bottom border-${theme === "dark" ? "light" : "dark"}`}
            >
              <h3 className="pb-2">Lyrics:</h3>
              <div className="d-flex flex-row mx-2 justify-content-center gap-md-2 gap-3 flex-wrap">
                {data?.lyricsFromParents?.map((item, index) => (
                  <button
                    key={index}
                    className={`btn px-2 py-1 fs-5 text-center fw-semibold border-3 border-${activeIndex === index ? "primary" : theme === "dark" ? "light" : "dark"} rounded-4 bg-${theme === "dark" ? "secondary" : "light"} text-${theme === "dark" ? "light" : "dark"} ${activeIndex === index ? "active" : ""}`}
                    onClick={() => {
                      setActiveIndex(index);
                      setIdLyric(item.id);
                    }}
                  >
                    {item.cultureCodes
                      ? item.cultureCodes?.map((code, idx) => (
                          <span key={idx}>
                            {LangCode(
                              code,
                              item.translationType === "Romanized",
                              item.translationType === "Original",
                            )}{" "}
                          </span>
                        ))
                      : ""}
                  </button>
                ))}
              </div>
              <p
                className="fs-4 text-center pt-3 mx-3"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {lyric?.data?.value}
              </p>
            </div>
          )}

          <div
            className={`w-100 d-flex justify-content-center flex-column align-items-center py-3 border-top bg-${theme === "dark" ? "dark" : "body-secondary"} border-bottom border-${theme === "dark" ? "light" : "dark"}`}
          >
            <h3>Original media:</h3>
            <div className="d-flex flex-column gap-3 p-3 mx-4">
              {data?.pvs?.map((item, idx) => (
                <a
                  key={idx}
                  className={`btn btn-${theme === "dark" ? "secondary" : "light"} border-3 border-${theme === "dark" ? "light" : "dark"} fs-5 align-items-center d-flex justify-content-center gap-1`}
                  role="button"
                  href={item.url}
                  target="_blank"
                >
                  {PlatformCode(item.service)} {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "500px" }}
        >
          <div
            className="spinner-border"
            role="status"
            style={{ width: "50px", height: "50px" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Detail;
