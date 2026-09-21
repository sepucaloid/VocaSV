import React from "react";

export const Type = ({ type }) => {
  if (type === "Original") {
    return (
      <div
        className="bg-primary d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "30px", height: "30px" }}
      >
        <h3 className="fw-bold">O</h3>
      </div>
    );
  } else if (type === "Remix") {
    return (
      <div
        className="bg-danger d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "30px", height: "30px" }}
      >
        <h3 className="fw-bold">R</h3>
      </div>
    );
  } else if (type === "Remaster") {
    return (
      <div
        className="bg-primary d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "30px", height: "30px" }}
      >
        <h3 className="fw-bold">R</h3>
      </div>
    );
  } else if (type === "Cover") {
    return (
      <div
        className="bg-secondary d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "30px", height: "30px" }}
      >
        <h3 className="fw-bold">C</h3>
      </div>
    );
  }
};
