import React from "react";
import "./Tag.css";

type TagProps = {
  displayText: string;
};

const Tag = ({ displayText }: TagProps) => {
  return <p className="tag-text">{displayText}</p>;
};

export default Tag;
