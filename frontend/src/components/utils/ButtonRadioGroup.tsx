/*  eslint react/jsx-props-no-spreading: 0 */
/*  eslint react/destructuring-assignment: 0 */
import React, { useEffect } from "react";
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
        _checked={props.isDisabled ? buttonStyleUnselected : buttonStyle}
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
  isDisabled?: boolean;
  options: string[];
  onChange: (newState: string) => void;
  dependentValue?: string;
  value?: string;
};

function ButtonRadioGroup({
  size = "secondary",
  stacked = true,
  unselectedVariant = "outline",
  name,
  defaultValue,
  isDisabled = false,
  options,
  dependentValue,
  onChange,
  value,
}: ButtonRadioGroupProps) {
  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name,
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  useEffect(() => {
    if (!options.includes(defaultValue)) {
      onChange(options[options.length - 1]);
      setValue(options[options.length - 1]);
    }
  }, [dependentValue]);

  useEffect(() => {
    if (value) {
      setValue(value);
    }
  }, [value]);

  return (
    <Flex direction={stacked ? "column" : "row"} {...group}>
      {options.map((val) => {
        const radio = getRadioProps({ value: val });
        return (
          <RadioCard
            key={val}
            size={size}
            unselectedVariant={unselectedVariant}
            {...radio}
            isDisabled={isDisabled}
          >
            {val}
          </RadioCard>
        );
      })}
    </Flex>
  );
}

export default ButtonRadioGroup;
