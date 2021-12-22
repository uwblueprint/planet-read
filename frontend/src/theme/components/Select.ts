import { StylesConfig } from "react-select";

const Select = {
  baseStyle: {},
  variants: {
    commentsFilter: {
      field: {
        fontSize: "14px",
        textAlignLast: "center",
        textTransform: "uppercase",
        color: "blue.100",
        fontWeight: "600",
      },
      icon: {
        color: "blue.100",
      },
    },
  },
};

export const colourStyles: StylesConfig = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#F1F4F7", // #F1F4F7 is gray.100
    border: "none",
  }),
  option: (styles, { isSelected }) => {
    return {
      ...styles,
      color: "black",
      backgroundColor: isSelected ? "#F1F4F7" : "white", // #F1F4F7 is gray.100
      "&:hover": {
        backgroundColor: "#F1F4F7", // #F1F4F7 is gray.100
      },
    };
  },
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  placeholder: (styles) => ({ ...styles, color: "black" }),
};

export default Select;
