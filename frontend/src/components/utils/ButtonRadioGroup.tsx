/*  eslint react/jsx-props-no-spreading: 0 */
/*  eslint react/destructuring-assignment: 0 */
import React, { useImperativeHandle, forwardRef, ForwardedRef } from "react";
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

  const buttonStyle = useStyleConfig("Button", { size: props.size });
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

export type ButtonRadioGroupHandle = {
  setValue: React.Dispatch<React.SetStateAction<string | number>>;
};

export type ButtonRadioGroupProps = {
  size?: string;
  stacked?: boolean;
  unselectedVariant?: string;
  name: string;
  defaultValue: string;
  options: string[];
  onChange: (newState: string) => void;
};

function ButtonRadioGroup(
  {
    size = "secondary",
    stacked = true,
    unselectedVariant = "outline",
    name,
    defaultValue,
    options,
    onChange,
  }: ButtonRadioGroupProps,
  ref: ForwardedRef<ButtonRadioGroupHandle>,
) {
  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name,
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  useImperativeHandle(ref, () => ({
    setValue,
  }));

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

export default forwardRef<ButtonRadioGroupHandle, ButtonRadioGroupProps>(
  ButtonRadioGroup,
);
