import React from "react";
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import "./FontSizeSlider.css";

type FontSizeSliderProps = {
  setFontSize: (val: string) => void;
};

const FontSizeSlider = ({ setFontSize }: FontSizeSliderProps) => {
  const handleSliderChange = (val: number) => {
    switch (val) {
      case 0:
        setFontSize("10px");
        break;
      case 1:
        setFontSize("12px");
        break;
      case 2:
        setFontSize("14px");
        break;
      default:
        setFontSize("12px");
        break;
    }
  };

  return (
    <div className="slider-container">
      <div>
        <p>aa</p>
      </div>
      <Slider
        defaultValue={1}
        min={0}
        max={2}
        step={1}
        colorScheme="twitter"
        onChange={(val) => handleSliderChange(val)}
      >
        <SliderTrack>
          <Box position="relative" right={10} />
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </div>
  );
};

export default FontSizeSlider;
