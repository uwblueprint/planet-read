const Textarea = {
  variants: {
    translationEditable: {
      border: "1px solid",
      borderColor: "gray.300",
      color: "gray.500",
      borderRadius: "3px",
      fontSize: "12px",
      height: "fit-content",
      padding: "10px",
      width: "50%",
      margin: "12px",
    },
    maxCharsReached: {
      border: "1px solid red",
      borderRadius: "3px",
      fontSize: "12px",
      height: "fit-content",
      margin: "0px 10px 10px 10px",
      padding: "10px",
      width: "50%",
    },
  },
};
export default Textarea;
