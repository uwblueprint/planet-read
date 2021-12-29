import React, { useContext, useState } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import {
  Button,
  Flex,
  Heading,
  Text,
  Textarea,
  useStyleConfig,
} from "@chakra-ui/react";
import { useQuery, useMutation } from "@apollo/client";

import AuthContext from "../../contexts/AuthContext";
import Header from "../navigation/Header";
import UserProfileForm from "../userProfile/UserProfileForm";
import {
  SoftDeleteUserResponse,
  SOFT_DELETE_USER,
} from "../../APIClients/mutations/UserMutations";
import {
  MANAGE_USERS_TABLE_DELETE_USER_BUTTON,
  MANAGE_USERS_TABLE_DELETE_USER_CONFIRMATION,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  AdditionalExperiences,
  GET_USER,
  User,
} from "../../APIClients/queries/UserQueries";
import {
  GET_STORY_TRANSLATIONS_BY_USER,
  StoryTranslation,
} from "../../APIClients/queries/StoryQueries";
import {
  ApprovedLanguagesMap,
  parseApprovedLanguages,
  parseUserBackground,
} from "../../utils/Utils";
import ApprovedLanguagesTable from "../userProfile/ApprovedLanguagesTable";
import AssignedStoryTranslationsTable from "../userProfile/AssignedStoryTranslationsTable";
import { StoryAssignStage } from "../../constants/Enums";
import InfoAlert from "../utils/InfoAlert";
import { useFileDownload } from "../../utils/FileUtils";

type UserProfilePageProps = {
  userId: string;
};

const UserProfilePage = () => {
  const { authenticatedUser } = useContext(AuthContext);
  const { userId } = useParams<UserProfilePageProps>();
  const isAdmin = authenticatedUser!!.role === "Admin";

  if (+authenticatedUser!!.id !== parseInt(userId, 10) && !isAdmin)
    return <Redirect to="/404" />;

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alert, setAlert] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState(0);
  const [storyTranslations, setStoryTranslations] = useState<
    StoryTranslation[]
  >([]);
  const [additionalExperiences, setAdditionalExperiences] =
    useState<AdditionalExperiences | null>(null);

  const [approvedLanguagesTranslation, setApprovedLanguagesTranslation] =
    useState<ApprovedLanguagesMap>();
  const [approvedLanguagesReview, setApprovedLanguagesReview] =
    useState<ApprovedLanguagesMap>();

  const [storyAssignStage, setStoryAssignStage] = useState<StoryAssignStage>(
    StoryAssignStage.INITIAL,
  );

  const history = useHistory();

  const [downloadFile] = useFileDownload(resumeId, "resume");

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
      setResumeId(user?.resume!);
      setApprovedLanguagesTranslation(translationLanguages);
      setApprovedLanguagesReview(reviewLanguages);
      setRole(
        `Translator ${
          Object.keys(reviewLanguages).length > 0 ? "& Reviewer" : ""
        }`,
      );
      setAdditionalExperiences(
        parseUserBackground(user?.additionalExperiences),
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
    history.push("/?tab=2");
  };

  const filterStyle = useStyleConfig("Filter");

  if (loading) return <div />;
  if (error) return <Redirect to="/404" />;

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
            Last active on
          </Heading>
          <Text>TODO</Text>
          {isAdmin && (
            <>
              <Heading size="sm" marginTop="36px">
                User Files
              </Heading>
              {/* TODO: replace file name */}
              <Button variant="link" onClick={() => downloadFile()}>
                resume.pdf
              </Button>
            </>
          )}
        </Flex>
        <Flex direction="column" margin="40px" flex={1}>
          {!isAdmin && <UserProfileForm isSignup={false} />}
          <Flex justifyContent="space-between" margin="40px 0 10px 0">
            <Heading size="lg"> Approved Languages & Levels </Heading>
          </Flex>
          {isAdmin &&
            (alert ? (
              <InfoAlert message={alertText} colour="orange.50" />
            ) : (
              <Flex height="50px" />
            ))}
          <ApprovedLanguagesTable
            approvedLanguagesTranslation={approvedLanguagesTranslation}
            approvedLanguagesReview={approvedLanguagesReview}
            setApprovedLanguagesTranslation={setApprovedLanguagesTranslation}
            setApprovedLanguagesReview={setApprovedLanguagesReview}
            userId={parseInt(userId, 10)}
            setAlertText={setAlertText}
            setAlert={setAlert}
            alertTimeout={alertTimeout}
            setAlertTimeout={setAlertTimeout}
            isAdmin={isAdmin}
          />
          <Heading size="lg" marginTop="56px" marginBottom="10px">
            Assigned Story Translations
          </Heading>
          {isAdmin &&
            (storyAssignStage !== StoryAssignStage.INITIAL ? (
              <InfoAlert
                colour="orange.50"
                message={
                  storyAssignStage === StoryAssignStage.SUCCESS
                    ? "A new story was assigned to the user."
                    : "No stories were assigned to the user."
                }
              />
            ) : (
              <Flex height="50px" />
            ))}
          <AssignedStoryTranslationsTable
            storyTranslations={storyTranslations}
            setStoryTranslations={setStoryTranslations}
            userId={parseInt(userId, 10)}
            approvedLanguagesTranslation={approvedLanguagesTranslation}
            approvedLanguagesReview={approvedLanguagesReview}
            setStoryAssignStage={setStoryAssignStage}
            isAdmin={isAdmin}
          />
          {isAdmin && (
            <>
              <Heading size="lg" marginTop="56px" marginBottom="20px">
                User Background
              </Heading>
              <Heading size="md" variant="subtitle" marginBottom="10px">
                Educational Qualifications
              </Heading>
              <Textarea
                isDisabled
                variant="disabled"
                height="150px"
                borderWidth="3px"
                resize="none"
                value={additionalExperiences?.educationalQualification ?? ""}
              />
              <Heading
                size="md"
                variant="subtitle"
                marginTop="26px"
                marginBottom="10px"
              >
                Language Experience
              </Heading>
              <Textarea
                isDisabled
                variant="disabled"
                height="150px"
                borderWidth="3px"
                resize="none"
                value={additionalExperiences?.languageExperience ?? ""}
              />
            </>
          )}
          {isAdmin && (
            <>
              <Heading size="md" fontWeight="500" marginTop="56px">
                Delete User
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
            </>
          )}
        </Flex>
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
