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
        break;
      case AdminPageOption.Translators:
        return <ManageTranslators />;
        break;
      case AdminPageOption.Reviewers:
        return <ManageReviewers />;
        break;
      default:
        return <ManageStoryTranslations />;
        break;
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
