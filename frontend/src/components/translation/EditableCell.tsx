import React from "react";
import "./EditableCell.css";

export type EditableCellProps = {
  text: string;
  storyTranslationContentId: number;
  onChange: (storyTranslationContentId: number, newContent: string) => void;
};

const EditableCell = ({
  text,
  storyTranslationContentId,
  onChange,
}: EditableCellProps) => {
  // Should this be stored here? should this store its own state? make own GQL requests?

  return (
    <textarea
      className="input-translation"
      value={text}
      onChange={(event) =>
        onChange(storyTranslationContentId, event.target.value)
      }
    />
  );
};

export default EditableCell;
