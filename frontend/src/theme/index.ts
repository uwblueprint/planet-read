import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import Badge from "./components/Badge";
import Button from "./components/Button";
import Disabled from "./components/Disabled";
import Filter from "./components/Filter";
import Heading from "./components/Heading";
import Link from "./components/Link";
import Select from "./components/Select";
import StoryCard from "./components/StoryCard";
import Text from "./components/Text";
import Textarea from "./components/Textarea";

const customTheme = extendTheme({
  fonts: {
    heading: `"Noto Sans"`,
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
    Disabled,
    Filter,
    Heading,
    Link,
    Text,
    Textarea,
    Select,
    StoryCard,
  },
});

export default customTheme;
