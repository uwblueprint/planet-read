import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import StoryList from "../story/StoryList";
import { StoryCardProps } from "../story/StoryCard";

const GET_STORIES = gql`
  query GetStories {
    stories {
      id
      title
      description
      youtubeLink
      level
    }
  }
`;

const HomePage = () => {
  const [stories, setStories] = useState<StoryCardProps[] | null>(null);

  useQuery(GET_STORIES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => setStories(data.stories),
  });

  return (
    <div>
      <h1>Stories</h1>
      <StoryList stories={stories} />
    </div>
  );
};

export default HomePage;
