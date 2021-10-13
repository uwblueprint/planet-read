import React, { useState } from "react";
import Header, { AdminPageOption } from "../navigation/Header";
import ManageStoryTranslations from "../admin/ManageStoryTranslations";
import ManageTranslators from "../admin/ManageTranslators";
import ManageReviewers from "../admin/ManageReviewers";

const AdminPage = () => {
  const [adminPageOption, setAdminPageOption] = useState(
    AdminPageOption.StoryTranslations,
  );
  const bodyComponent = (adminPgOption: AdminPageOption) => {
    switch (adminPgOption) {
      case AdminPageOption.StoryTranslations:
        return <ManageStoryTranslations />;
      case AdminPageOption.Translators:
        return <ManageTranslators />;
      case AdminPageOption.Reviewers:
        return <ManageReviewers />;
      default:
        return <ManageStoryTranslations />;
    }
  };
  return (
    <>
      <Header
        adminPageOption={adminPageOption}
        setAdminPageOption={setAdminPageOption}
      />
      {bodyComponent(adminPageOption)}
    </>
  );
};

export default AdminPage;
