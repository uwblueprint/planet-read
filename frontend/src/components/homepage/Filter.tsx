import React from "react";

import ToggleButton from "../navigation/ToggleButton";
import "./Filter.css";

export type FilterProps = {
  approvedLanguages: { [name: string]: number };
  level: number;
  setLevel: (newState: number) => void;
  language: string;
  setLanguage: (newState: string) => void;
  role: boolean;
  setRole: (newState: boolean) => void;
};

const Filter = ({
  approvedLanguages,
  level,
  setLevel,
  language,
  setLanguage,
  role,
  setRole,
}: FilterProps) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(parseInt(event.target.value, 10));
  };
  const languageOptions = Object.keys(approvedLanguages).map((lang) => (
    <option key={lang} value={lang}>
      {lang}
    </option>
  ));
  const maxLvl = approvedLanguages[language];
  const lvlOptions = [];
  for (let i = 1; i <= maxLvl; i += 1) {
    lvlOptions.push(
      <option key={i.toString()} value={i.toString()} label={i.toString()} />,
    );
  }
  return (
    <div className="filter">
      <h1>Filter Stories</h1>
      <div>
        <h4>TRANSLATION LANGUAGE</h4>
        <select
          name="language"
          id="language"
          value={language}
          onChange={handleSelectChange}
        >
          {languageOptions}
        </select>
      </div>
      <div>
        <h4>ROLE</h4>
        <ToggleButton
          leftStateIsSelected={role}
          leftStateLabel="For Translation"
          rightStateLabel="For Review"
          onToggle={setRole}
        />
      </div>
      <div id="filter-level">
        <h4>LEVEL</h4>
        <input
          type="range"
          min={1}
          max={maxLvl}
          step="1"
          list="tickmarks"
          value={level}
          onChange={handleRangeChange}
        />
        <datalist id="tickmarks">{lvlOptions}</datalist>
      </div>
    </div>
  );
};

export default Filter;
