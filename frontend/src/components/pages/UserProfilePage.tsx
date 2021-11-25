import React, { useState } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import { useQuery, useMutation } from "@apollo/client";
import Header from "../navigation/Header";
import {
  SoftDeleteUserResponse,
  SOFT_DELETE_USER,
} from "../../APIClients/mutations/UserMutations";
import {
  MANAGE_USERS_TABLE_DELETE_USER_BUTTON,
  MANAGE_USERS_TABLE_DELETE_USER_CONFIRMATION,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";
import { GET_USER, User } from "../../APIClients/queries/UserQueries";
import {
  GET_STORY_TRANSLATIONS_BY_USER,
  StoryTranslation,
} from "../../APIClients/queries/StoryQueries";
import {
  ApprovedLanguagesMap,
  parseApprovedLanguages,
} from "../../utils/Utils";
import AssignedStoryTranslationsTable from "../admin/AssignedStoryTranslationsTable";

type UserProfilePageProps = {
  userId: string;
};

const UserProfilePage = () => {
  const { userId } = useParams<UserProfilePageProps>();

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [storyTranslations, setStoryTranslations] = useState<
    StoryTranslation[]
  >([]);

  // TODO: remove this when tables are implemented
  /* eslint-disable */
  const [approvedLanguagesTranslation, setApprovedLanguagesTranslation] =
    useState<ApprovedLanguagesMap>();
  const [approvedLanguagesReview, setApprovedLanguagesReview] =
    useState<ApprovedLanguagesMap>();

  const history = useHistory();

  const { loading, error } = useQuery(GET_USER(parseInt(userId, 10)), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data: { userById: User }) => {
      const user = data.userById;
      const translationLanguages = parseApprovedLanguages(
        user?.approvedLanguagesTranslation,
      );
      const reviewLanguages = parseApprovedLanguages(
        user?.approvedLanguagesReview,
      );
      setFullName(`${user?.firstName} ${user?.lastName}`);
      setEmail(user?.email!);
      setApprovedLanguagesTranslation(translationLanguages);
      setApprovedLanguagesReview(reviewLanguages);
      setRole(
        `Translator ${
          Object.keys(reviewLanguages).length > 0 ? "& Reviewer" : ""
        }`,
      );
    },
  });

  useQuery(GET_STORY_TRANSLATIONS_BY_USER(parseInt(userId, 10)), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setStoryTranslations(data.storyTranslationsByUser);
    },
  });

  const [deleteUser] = useMutation<{
    response: SoftDeleteUserResponse;
  }>(SOFT_DELETE_USER);

  const closeModal = () => {
    setConfirmDeleteUser(false);
  };

  const openModal = () => {
    setConfirmDeleteUser(true);
  };

  const callSoftDeleteUserMutation = async () => {
    await deleteUser({
      variables: {
        id: userId,
      },
    });
    closeModal();
    history.push("/");
  };

  const filterStyle = useStyleConfig("Filter");

  if (loading) return <div />;
  if (error) return <Redirect to="/404" />;

  // TODO: make util function for parsing json

  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex direction="row" flex={1}>
        <Flex sx={filterStyle} maxWidth="400px">
          <Heading size="lg">{fullName}</Heading>
          <Heading size="sm" marginTop="36px">
            Role(s)
          </Heading>
          <Text>{role}</Text>
          <Heading size="sm" marginTop="36px">
            Email
          </Heading>
          <Text>{email}</Text>
          <Heading size="sm" marginTop="36px">
            Date joined
          </Heading>
          <Text>TODO</Text>
          <Heading size="sm" marginTop="36px">
            Last active on
          </Heading>
          <Text>TODO</Text>
        </Flex>
        <Flex direction="column" margin="40px" width="100%">
          <Heading size="lg" marginTop="40px">
            Approved Languages & Levels
          </Heading>
          <Text>TODO: table here</Text>
          <Heading size="lg" marginTop="56px" marginBottom="20px">
            Assigned Story Translations
          </Heading>
          <AssignedStoryTranslationsTable
            storyTranslations={storyTranslations}
            setStoryTranslations={setStoryTranslations}
            userId={parseInt(userId, 10)}
          />
          <Heading size="sm" marginTop="56px">
            Delete user
          </Heading>
          <Text>
            Permanently delete this user and all data associated with them.
          </Text>
          <Button
            colorScheme="red"
            margin="10px 0px"
            width="250px"
            variant="outline"
            onClick={() => openModal()}
          >
            Delete User
          </Button>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        boxShadow="0 0 12px -9px rgba(0, 0, 0, 0.7)"
        direction="row"
        height="90px"
        justify="flex-end"
        padding="20px 30px"
      >
        <Box>
          <Button colorScheme="blue" variant="blueOutline">
            Cancel
          </Button>
          {/* TODO: make this functional.*/}
          <Button colorScheme="blue" marginLeft="24px" marginRight="48px">
            Save Changes
          </Button>
        </Box>
      </Flex>
      {confirmDeleteUser && (
        <ConfirmationModal
          confirmation={confirmDeleteUser}
          onClose={closeModal}
          onConfirmationClick={callSoftDeleteUserMutation}
          confirmationMessage={MANAGE_USERS_TABLE_DELETE_USER_CONFIRMATION}
          buttonMessage={MANAGE_USERS_TABLE_DELETE_USER_BUTTON}
        />
      )}
    </Flex>
  );
};

export default UserProfilePage;
