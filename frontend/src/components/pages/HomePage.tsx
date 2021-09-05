import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Divider, Flex } from "@chakra-ui/react";

import Filter from "../homepage/Filter";
import StoryList from "../homepage/StoryList";
import { StoryCardProps } from "../homepage/StoryCard";
import AuthContext from "../../contexts/AuthContext";
import ButtonRadioGroup from "../utils/ButtonRadioGroup";
import Header from "../navigation/Header";
import { buildHomePageStoriesQuery } from "../../APIClients/queries/StoryQueries";

const HomePage = () => {
  const { authenticatedUser } = useContext(AuthContext);

  const approvedLanguages = JSON.parse(
    authenticatedUser!!.approvedLanguages.replace(/'/g, '"'),
  );

  const [displayMyStories, setDisplayMyStories] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>(
    Object.keys(approvedLanguages)[0],
  );
  const [isTranslator, setIsTranslator] = useState<boolean>(true);
  const [level, setLevel] = useState<number>(approvedLanguages[language]);
  const [stories, setStories] = useState<StoryCardProps[] | null>(null);

  const handleDisplayMyStoriesChange = (nextOption: string) => {
    setDisplayMyStories(nextOption === "My Work");
  };

  const query = buildHomePageStoriesQuery(
    displayMyStories,
    language,
    isTranslator,
    level,
    +authenticatedUser!!.id,
  );

  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    // Assumes independent queries (query will never include two sub-queries)
    onCompleted: (data) => setStories(data[query.fieldName]),
  });
  return (
    <Box>
      <Header title="" />
      <Divider />
      <Flex direction="row">
        <Filter
          approvedLanguages={approvedLanguages}
          level={level}
          setLevel={setLevel}
          language={language}
          setLanguage={setLanguage}
          role={isTranslator}
          setIsTranslator={setIsTranslator}
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
            options={["My Work", "Browse Stories"]}
            name="My Work and Browse Stories toggle"
            defaultValue="My Work"
            onChange={handleDisplayMyStoriesChange}
          />
          <StoryList
            stories={stories}
            language={language}
            displayMyStories={displayMyStories}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default HomePage;
