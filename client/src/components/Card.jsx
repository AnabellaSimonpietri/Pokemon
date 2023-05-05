import React from "react";

export default function Card({ img, name, type }) {
  return (
    <div>
      <h3>{name}</h3>
      <h5>{type}</h5>
      <img src={img} alt="img not found" width="200px" height="250px" />
    </div>
  );
}
