const Badge = {
  baseStyle: {
    borderRadius: "24px",
    fontSize: "14px",
    padding: "6px 10px",
    margin: "0 5px",
    textTransform: "capitalize",
    textAlign: "center",
  },
  variants: {
    pending: {
      backgroundColor: "gray.100",
      color: "gray.400",
    },
    action: {
      backgroundColor: "orange.50",
      color: "orange.100",
    },
    approved: {
      backgroundColor: "green.50",
      color: "green.100",
    },
    stage: {
      backgroundColor: "blue.50",
    },
    role: {
      backgroundColor: "blue.50",
    },
    language: {
      backgroundColor: "gray.200",
    },
  },
  sizes: {
    s: {
      fontSize: "xs",
      marginLeft: "0px",
      marginRight: "15px",
    },
  },
};
export default Badge;
