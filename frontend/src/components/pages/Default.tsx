import React from "react";
import { useHistory } from "react-router-dom";

import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";
import ResetPassword from "../auth/ResetPassword";
import StoryCard from "../story/StoryCard";

const CreateButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("/entity/create");

  return (
    <button className="btn btn-primary" onClick={navigateTo} type="button">
      Create Entity
    </button>
  );
};

const UpdateButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("/entity/update");

  return (
    <button className="btn btn-primary" onClick={navigateTo} type="button">
      Update Entity
    </button>
  );
};

const GetButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("/entity");
  return (
    <button className="btn btn-primary" onClick={navigateTo} type="button">
      Display Entities
    </button>
  );
};

const sampleResponse = {
  data: {
    storyById: {
      id: 1,
      title: "Test Title",
      description: `He sat across from her trying to imagine it was the first time. 
      It wasn't. Had it been a hundred? It quite possibly could have been. 
      Two hundred? Probably not. His mind wandered until he caught himself 
      and again tried to imagine it was the first time.`,
      youtubeLink: "https://www.youtube.com/watch?v=_OBlgSz8sSM",
      level: 3,
      translatedLanguages: [],
      contents: [],
    },
  },
};

const Default = () => {
  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <h1>Default Page</h1>
      <div className="btn-group" style={{ paddingRight: "10px" }}>
        <Logout />
        <RefreshCredentials />
        <ResetPassword />
        <CreateButton />
        <UpdateButton />
        <GetButton />
      </div>
      <StoryCard
        id={sampleResponse.data.storyById.id}
        title={sampleResponse.data.storyById.title}
        description={sampleResponse.data.storyById.description}
        youtubeLink={sampleResponse.data.storyById.youtubeLink}
        level={sampleResponse.data.storyById.level}
      />
    </div>
  );
};

export default Default;
