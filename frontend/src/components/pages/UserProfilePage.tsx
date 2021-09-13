import React from "react";
import { useParams } from "react-router-dom";

type UserProfilePageProps = {
  userId: string | undefined;
};

const UserProfilePage = () => {
  const { userId } = useParams<UserProfilePageProps>();

  return (
    <div style={{ textAlign: "center" }}>
      <h1>User Profile for {userId} :)</h1>
    </div>
  );
};

export default UserProfilePage;
