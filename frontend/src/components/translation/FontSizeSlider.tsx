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
        setFontSize("12px");
        break;
      case 1:
        setFontSize("16px");
        break;
      case 2:
        setFontSize("24px");
        break;
      default:
        setFontSize("12px");
        break;
    }
  };

  return (
    <div className="slider-container">
      <div className="slider-labels">
        <div className="sm-font">Aa</div>
        <div className="med-font"> Aa</div>
        <div className="lg-font">Aa</div>
      </div>
      <Slider
        defaultValue={0}
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
        <SliderThumb boxSize={3} />
      </Slider>
    </div>
  );
};

export default FontSizeSlider;
