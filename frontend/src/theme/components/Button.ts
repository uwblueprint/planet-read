const Button = {
  baseStyle: {
    fontSize: "14px",
    textAlign: "center",
    textTransform: "uppercase",
    height: "40px",
    width: "160px",
  },
  sizes: {
    primary: {
      width: "30px",
    },
    secondary: {
      color: "blue.100",
    },
    tertiary: {
      color: "black",
      textDecoration: "underline",
    },
    undoRedo: {
      width: "36px",
      height: "36px",
      fontSize: "20px",
    },
    clear: {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
    },
  },
  variants: {
    outline: {
      background: "white",
      borderColor: "gray.50",
      color: "blue.100",
    },
    clear: {
      marginLeft: "10px",
      padding: "10px",
      background: "gray.100",
      color: "gray.700",
    },
    ghost: {
      background: "transparent",
      textDecoration: "none",
    },
    addComment: {
      border: "1px solid",
      borderColor: "gray.50",
      background: "white",
      color: "blue.100",
      width: "100px",
      fontSize: "14px",
    },
    scrollToTop: {
      background: "white",
      border: "1px solid",
      borderColor: "gray.300",
      bottom: "10px",
      fontSize: "14px",
      position: "fixed",
      right: "10px",
      width: "50px",
    },
    header: {
      background: "transparent",
      fontWeight: "lighter",
      padding: "30px",
      textTransform: "capitalize",
      width: "fit-content",
    },
    headerSelect: {
      background: "transparent",
      borderRadius: "0px",
      borderBottom: "3px solid",
      borderBottomColor: "blue.100",
      color: "blue.100",
      padding: "30px 30px 27px 30px",
      textTransform: "capitalize",
      width: "fit-content",
    },
    commentLabel: {
      background: "transparent",
      fontSize: "12px",
      justifyContent: "flex-start",
      padding: "0px",
      textTransform: "capitalize",
      width: "40px",
    },
  },
};
export default Button;
