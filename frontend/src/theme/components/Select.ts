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
    disabled: {
      field: {
        opacity: 0.25,
        pointerEvents: "none",
      },
      icon: {
        opacity: 0.25,
        pointerEvents: "none",
      },
    },
  },
};

export default Select;
