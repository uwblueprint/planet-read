import { extendTheme } from "@chakra-ui/react";
import { Theme } from "@chakra-ui/theme";

import colors from "./colors";
import Badge from "./components/Badge";
import Button from "./components/Button";
import Filter from "./components/Filter";
import Text from "./components/Text";
import Textarea from "./components/Textarea";
import StoryCard from "./components/StoryCard";

const customTheme: Theme = extendTheme({
  fonts: {
    body: `"Noto Sans"`,
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
    Text,
    Textarea,
    StoryCard,
  },
});

export default customTheme;
