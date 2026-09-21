import React from "react";

export const TypeVocal = ({ type }) => {
  if (type === "Vocaloid" || type === "VOCALOID") {
    return (
      <div
        className="bg-primary d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "30px", height: "30px" }}
      >
        <h3 className="fw-bold">V</h3>
      </div>
    );
  } else if (type === "UTAU") {
    return (
      <div
        className="bg-danger d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "30px", height: "30px" }}
      >
        <h3 className="fw-bold">U</h3>
      </div>
    );
  } else if (type === "SynthesizerV" || type === "Synthesizer V") {
    return (
      <div
        className="bg-secondary d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "40px", height: "35px" }}
      >
        <h3 className="fw-bold">SV</h3>
      </div>
    );
  } else if (type === "CeVIO") {
    return (
      <div
        className="bg-success d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "30px", height: "30px" }}
      >
        <h3 className="fw-bold">C</h3>
      </div>
    );
  } else if (type === "VoiSona") {
    return (
      <div
        className="bg-secondary d-flex justify-content-center align-text-center rounded text-light"
        style={{ width: "40px", height: "35px" }}
      >
        <h3 className="fw-bold">VS</h3>
      </div>
    );
  }
};
