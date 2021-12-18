import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdKeyboardArrowUp } from "react-icons/md";

import Filter from "../homepage/Filter";
import StoryList from "../homepage/StoryList";
import { StoryCardProps } from "../homepage/StoryCard";
import AuthContext from "../../contexts/AuthContext";
import ButtonRadioGroup from "../utils/ButtonRadioGroup";
import Header from "../navigation/Header";
import { buildHomePageStoriesQuery } from "../../APIClients/queries/StoryQueries";
import { parseApprovedLanguages } from "../../utils/Utils";

const HomePage = () => {
  const { authenticatedUser } = useContext(AuthContext);

  const approvedLanguagesTranslation = parseApprovedLanguages(
    authenticatedUser!!.approvedLanguagesTranslation,
  );

  const approvedLanguagesReview = parseApprovedLanguages(
    authenticatedUser!!.approvedLanguagesReview,
  );

  const [displayMyStories, setDisplayMyStories] = useState<boolean>(true);
  const [displayMyTests, setDisplayMyTests] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>(
    Object.keys(approvedLanguagesTranslation)[0],
  );
  const [isTranslator, setIsTranslator] = useState<boolean>(true);
  const [level, setLevel] = useState<number>(1);
  const [stories, setStories] = useState<StoryCardProps[] | null>(null);

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      // Show scroll to top button if user scrolls down vertically more than 100px
      if (window.scrollY > 100) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    });
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDisplayMyStoriesChange = (nextOption: string) => {
    setStories(null);
    setDisplayMyTests(nextOption === "My Tests");
    setDisplayMyStories(nextOption === "My Work");
  };

  const query = buildHomePageStoriesQuery(
    displayMyStories,
    displayMyTests,
    language,
    isTranslator,
    level,
    +authenticatedUser!!.id,
  );

  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    // Assumes independent queries (query will never include two sub-queries)
    onCompleted: (data) => {
      // Only the storyTranslationsByUser query returns the language in the gql
      // response; otherwise it must be added based on the user's language filter
      const storyData =
        displayMyStories || displayMyTests
          ? data[query.fieldName]
          : data[query.fieldName].map((storyObj: any) => ({
              ...storyObj,
              language,
            }));
      setStories(storyData);
    },
  });
  return (
    <Box>
      <Header />
      <Divider />
      <Flex direction="row">
        <Filter
          approvedLanguagesTranslation={approvedLanguagesTranslation}
          approvedLanguagesReview={approvedLanguagesReview}
          level={level}
          setLevel={setLevel}
          language={language}
          setLanguage={setLanguage}
          role={isTranslator}
          setIsTranslator={setIsTranslator}
          isDisabled={displayMyStories || displayMyTests}
        />
        <Flex
          direction="column"
          alignItems="center"
          padding="25px 0px 0px 100px"
          width="1000px"
        >
          <ButtonRadioGroup
            size="tertiary"
            stacked={false}
            unselectedVariant="ghost"
            options={["My Work", "Browse Stories", "My Tests"]}
            name="My Work, Browse Stories, and My Tests toggle"
            defaultValue="My Work"
            onChange={handleDisplayMyStoriesChange}
          />
          <StoryList
            stories={stories}
            displayMyStories={displayMyStories}
            displayMyTests={displayMyTests}
          />
        </Flex>
      </Flex>
      {showScrollToTop && (
        <Button onClick={handleScrollToTop} size="lg" variant="scrollToTop">
          <Icon as={MdKeyboardArrowUp} height={8} width={8} />
        </Button>
      )}
    </Box>
  );
};

export default HomePage;
