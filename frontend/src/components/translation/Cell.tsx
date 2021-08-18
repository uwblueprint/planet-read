import React from "react";
import "./Cell.css";

export type CellProps = {
  text: string;
  fontSize: string;
};

const Cell = ({ text, fontSize }: CellProps) => {
  return (
    <p className="cell" style={{ fontSize }}>
      {text}
    </p>
  );
};

export default Cell;
