import { extendTheme } from "@chakra-ui/react";
import { Theme } from "@chakra-ui/theme";

import colors from "./colors";
import Badge from "./components/Badge";
import Button from "./components/Button";
import Filter from "./components/Filter";
import StoryCard from "./components/StoryCard";

const customTheme: Theme = extendTheme({
  fonts: {
    body: `"Comic Sans MS"`,
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  colors,
  components: {
    Badge,
    Button,
    Filter,
    StoryCard,
  },
});

export default customTheme;
