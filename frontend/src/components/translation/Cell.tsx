import React from "react";
import "./Cell.css";

export type CellProps = {
  text: string;
};

const Cell = ({ text }: CellProps) => {
  return <p className="cell">{text}</p>;
};

export default Cell;
