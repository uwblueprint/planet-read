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
import useQueryParams from "../../utils/hooks/useQueryParams";

enum HomepageOption {
  MyStories = 0,
  BrowseStories,
  MyTests,
}

const tabHeaderOptions = ["My Work", "Browse Stories", "My Tests"];

const HomePage = () => {
  const { authenticatedUser } = useContext(AuthContext);
  const queryParams = useQueryParams();

  const approvedLanguagesTranslation = parseApprovedLanguages(
    authenticatedUser!!.approvedLanguagesTranslation,
  );

  const approvedLanguagesReview = parseApprovedLanguages(
    authenticatedUser!!.approvedLanguagesReview,
  );

  const getPageOptionFromURL = () => {
    const tab: string | null = queryParams.get("tab");
    if (!tab || Number.isNaN(parseInt(tab, 10))) {
      return HomepageOption.MyStories;
    }

    const index = parseInt(tab, 10);
    return index >= 0 && index <= 2 ? index : -1;
  };

  const [pageOption, setPageOption] = useState<HomepageOption>(
    getPageOptionFromURL(),
  );
  const [language, setLanguage] = useState<string>(
    Object.keys(approvedLanguagesTranslation)[0],
  );
  const [isTranslator, setIsTranslator] = useState<boolean>(true);
  const [level, setLevel] = useState<number>(1);
  const [stories, setStories] = useState<StoryCardProps[] | null>(null);

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const index = getPageOptionFromURL();
    if (index === -1) {
      window.location.href = "/";
    } else {
      setPageOption(index);
    }
  }, [queryParams.get("tab")]);

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
    let newIndex;
    if (nextOption === "My Work") {
      newIndex = 0;
    } else if (nextOption === "Browse Stories") {
      newIndex = 1;
    } else if (nextOption === "My Tests") {
      newIndex = 2;
    }
    window.location.href = `/#/?tab=${newIndex}`;
  };

  const query = buildHomePageStoriesQuery(
    pageOption === HomepageOption.MyStories,
    pageOption === HomepageOption.MyTests,
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
        pageOption === HomepageOption.MyStories ||
        pageOption === HomepageOption.MyTests
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
          isDisabled={pageOption !== HomepageOption.BrowseStories}
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
            options={tabHeaderOptions}
            name="My Work, Browse Stories, and My Tests toggle"
            defaultValue={tabHeaderOptions[pageOption]}
            onChange={handleDisplayMyStoriesChange}
            value={tabHeaderOptions[pageOption]}
          />
          <StoryList
            stories={stories}
            displayMyStories={pageOption === HomepageOption.MyStories}
            displayMyTests={pageOption === HomepageOption.MyTests}
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
