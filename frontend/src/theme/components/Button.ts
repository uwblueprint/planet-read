const Button = {
  baseStyle: {
    fontSize: "14px",
    fontWeight: "thin",
    textAlign: "center",
  },
  sizes: {
    tertiary: {
      background: "blue.50",
      color: "black",
      height: "40px",
      textDecoration: "underline",
      width: "143px",
    },
    wideLg: {
      height: "40px",
      lineHeight: "24px",
      width: "216px",
    },
    secondary: {
      color: "blue.300",
      height: "40px",
      width: "150px",
    },
  },
  variants: {
    outline: {
      background: "white",
      borderColor: "blue.100",
      color: "blue.300",
    },
    ghost: {
      background: "transparent",
      textDecoration: "none",
    },
  },
};
export default Button;
