import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Box, Button, Icon, Flex, Heading } from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import StoriesTable from "./StoriesTable";
import { Story, GET_STORIES } from "../../APIClients/queries/StoryQueries";

const ManageStories = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useQuery(GET_STORIES(), {
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
            as={MdLogout}
            height={5}
            margin="5px"
            transform="rotate(270deg)"
            width={5}
          />
          IMPORT STORY
        </Button>
      </Flex>
      <StoriesTable stories={stories} setStories={setStories} />
    </Box>
  );
};

export default ManageStories;
