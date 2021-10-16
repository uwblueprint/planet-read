import React, { useState } from "react";
import Header, { AdminPageOption } from "../navigation/Header";
import ManageStoryTranslations from "../admin/ManageStoryTranslations";
import ManageUsers from "../admin/ManageUsers";

const AdminPage = () => {
  const [adminPageOption, setAdminPageOption] = useState(
    AdminPageOption.StoryTranslations,
  );
  const bodyComponent = (adminPgOption: AdminPageOption) => {
    switch (adminPgOption) {
      case AdminPageOption.StoryTranslations:
        return <ManageStoryTranslations />;
      case AdminPageOption.Translators:
        return <ManageUsers isTranslators />;
      case AdminPageOption.Reviewers:
        return <ManageUsers isTranslators={false} />;
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
