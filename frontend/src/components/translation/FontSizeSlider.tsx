import React from "react";
import {
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

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
    <Box width="100px">
      <Flex justify="space-between" align="baseline">
        <Flex fontSize="12px">Aa</Flex>
        <Flex fontSize="16px"> Aa</Flex>
        <Flex fontSize="24px">Aa</Flex>
      </Flex>
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
        <SliderThumb boxSize={3} boxShadow="0px 0px 2px black" />
      </Slider>
    </Box>
  );
};

export default FontSizeSlider;
