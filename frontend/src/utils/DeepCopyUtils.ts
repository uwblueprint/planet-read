const deepCopy = (lines: Object) => {
  // This is a funky method to make deep copies on objects with primative values
  // https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
  // Should probably go under some util
  return JSON.parse(JSON.stringify(lines));
};

export default deepCopy;
