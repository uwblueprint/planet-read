/*  eslint react/jsx-props-no-spreading: 0 */
/*  eslint react/destructuring-assignment: 0 */
import React from "react";
import {
  Box,
  Flex,
  useRadio,
  useRadioGroup,
  useStyleConfig,
} from "@chakra-ui/react";

function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const buttonStyle = useStyleConfig("Button", {
    size: props.size,
  });
  const buttonStyleUnselected = useStyleConfig("Button", {
    size: props.size,
    variant: props.unselectedVariant,
  });

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        sx={buttonStyleUnselected}
        _checked={buttonStyle}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export type ButtonRadioGroupProps = {
  size?: string;
  stacked?: boolean;
  unselectedVariant?: string;
  name: string;
  defaultValue: string;
  options: string[];
  onChange: (newState: string) => void;
};

function ButtonRadioGroup({
  size = "secondary",
  stacked = true,
  unselectedVariant = "outline",
  name,
  defaultValue,
  options,
  onChange,
}: ButtonRadioGroupProps) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  return (
    <Flex direction={stacked ? "column" : "row"} {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard
            key={value}
            size={size}
            unselectedVariant={unselectedVariant}
            {...radio}
          >
            {value}
          </RadioCard>
        );
      })}
    </Flex>
  );
}

export default ButtonRadioGroup;
