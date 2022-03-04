import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Box, Button, Icon, Flex, Heading } from "@chakra-ui/react";
import { MdLogin } from "react-icons/md";
import StoriesTable from "./StoriesTable";
import { Story, GET_STORIES } from "../../APIClients/queries/StoryQueries";
import TableFilter from "./TableFilter";
import { STORY_TRANSLATION_TABLE_FILTER_SEARCH_BAR_PLACEHOLDER } from "../../utils/Copy";

const ManageStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { loading } = useQuery(GET_STORIES(searchText, startDate, endDate), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setStories(data.stories);
    },
  });

  const history = useHistory();
  const routeChange = () => {
    history.push("/import-story");
  };

  return (
    <Box textAlign="center">
      <Flex margin="20px 30px">
        <Heading float="left" size="lg">
          Manage Stories
        </Heading>
        <Button
          margin="5px 0px 5px 15px"
          onClick={routeChange}
          variant="blueOutline"
          width="180px"
        >
          <Icon
            as={MdLogin}
            height={5}
            margin="5px"
            transform="rotate(90deg)"
            width={5}
          />
          IMPORT STORY
        </Button>
      </Flex>
      <TableFilter
        language={null}
        level={null}
        searchText={searchText}
        setSearchText={setSearchText}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDate={startDate}
        endDate={endDate}
        useLevel={false}
        useLanguage={false}
        useDate
        searchBarPlaceholder={
          STORY_TRANSLATION_TABLE_FILTER_SEARCH_BAR_PLACEHOLDER
        }
      />
      <StoriesTable
        stories={stories}
        setStories={setStories}
        filters={[setSearchText, setStartDate, setEndDate]}
        loading={loading}
      />
    </Box>
  );
};

export default ManageStories;
