import React from "react";
import Header, { AdminPageOption } from "../navigation/Header";
import ManageStoryTranslations from "../admin/ManageStoryTranslations";
import ManageStories from "../admin/ManageStories";
import ManageUsers from "../admin/ManageUsers";
import ManageStoryTests from "../admin/ManageStoryTests";
import useQueryParams from "../../utils/hooks/useQueryParams";

const AdminPage = () => {
  const queryParams = useQueryParams();

  const getPageOptionFromURL = () => {
    const tab: string | null = queryParams.get("tab");
    if (!tab || Number.isNaN(parseInt(tab, 10))) {
      return AdminPageOption.StoryTranslations;
    }

    const index = parseInt(tab, 10);
    return index >= AdminPageOption.StoryTranslations &&
      index <= AdminPageOption.Tests
      ? index
      : -1;
  };

  const adminPageOption = getPageOptionFromURL();
  if (adminPageOption === -1) {
    window.location.href = "#/";
  }
  const bodyComponent = (adminPgOption: AdminPageOption) => {
    switch (adminPgOption) {
      case AdminPageOption.StoryTranslations:
        return <ManageStoryTranslations />;
      case AdminPageOption.Stories:
        return <ManageStories />;
      case AdminPageOption.Translators:
        return <ManageUsers isTranslators />;
      case AdminPageOption.Reviewers:
        return <ManageUsers isTranslators={false} />;
      case AdminPageOption.Tests:
        return <ManageStoryTests />;
      default:
        return <ManageStoryTranslations />;
    }
  };
  return (
    <>
      <Header adminPageOption={adminPageOption} />
      {bodyComponent(adminPageOption)}
    </>
  );
};

export default AdminPage;
