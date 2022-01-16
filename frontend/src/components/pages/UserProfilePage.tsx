import React, { useContext, useState } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import {
  Box,
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
  UpdateMeResponse,
  UPDATE_ME,
} from "../../APIClients/mutations/UserMutations";
import {
  MANAGE_USERS_TABLE_DELETE_USER_BUTTON,
  MANAGE_USERS_TABLE_DELETE_USER_CONFIRMATION,
  USER_PROFILE_PAGE_SAVE_CHANGES_BUTTON,
  USER_PROFILE_PAGE_SAVE_CHANGES_CONFIRMATION,
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
  getMessageFromStoryAssignStage,
  parseApprovedLanguages,
  parseUserBackground,
} from "../../utils/Utils";
import ApprovedLanguagesTable from "../userProfile/ApprovedLanguagesTable";
import AssignedStoryTranslationsTable from "../userProfile/AssignedStoryTranslationsTable";
import { StoryAssignStage } from "../../constants/Enums";
import InfoAlert from "../utils/InfoAlert";
import { useFileDownload } from "../../utils/FileUtils";
import { getFileQuery } from "../../APIClients/queries/FileQueries";
import authAPIClient from "../../APIClients/AuthAPIClient";

type UserProfilePageProps = {
  userId: string;
};

const UserProfilePage = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
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

  const resumeFileName = [...fullName.split(" "), "resume"].join("_");
  const [resume, setResume] = useState<File | null>(null);

  const [tempFullName, setTempFullName] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  const [tempEducationalQualification, setTempEducationalQualification] =
    useState<string>("");
  const [tempLanguageExperience, setTempLanguageExperience] =
    useState<string>("");

  const [confirmSaveChanges, setConfirmSaveChanges] = useState(false);

  const history = useHistory();

  const [downloadFile] = useFileDownload(resumeFileName, getFileQuery);

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
      setTempFullName(`${user?.firstName} ${user?.lastName}`);
      setTempEmail(user?.email!);
      const tempAdditionalExperiences = parseUserBackground(
        user?.additionalExperiences,
      );
      setTempEducationalQualification(
        tempAdditionalExperiences?.educationalQualification
          ? tempAdditionalExperiences?.educationalQualification
          : "",
      );
      setTempLanguageExperience(
        tempAdditionalExperiences?.languageExperience
          ? tempAdditionalExperiences?.languageExperience
          : "",
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

  const [updateMe] = useMutation<{
    response: UpdateMeResponse;
  }>(UPDATE_ME);

  const closeModal = () => {
    setConfirmDeleteUser(false);
  };

  const openModal = () => {
    setConfirmDeleteUser(true);
  };

  const closeSaveChangesModal = () => {
    setConfirmSaveChanges(false);
  };

  const openSaveChangesModal = () => {
    setConfirmSaveChanges(true);
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

  const updateResume = (updatedResume: File | null) => {
    setResume(updatedResume);
  };

  const saveChanges = async () => {
    try {
      const [firstName, lastName] = tempFullName.split(" ");
      const tempAdditionalExperiences = {
        educationalQualification: tempEducationalQualification,
        languageExperience: tempLanguageExperience,
      };
      const stringTempAddExp = JSON.stringify(tempAdditionalExperiences);
      const userData = {
        firstName,
        lastName,
        email: tempEmail,
        additionalExperiences: stringTempAddExp,
      };
      await updateMe({
        variables: {
          userData,
          resume,
        },
      });
      if (email === tempEmail) {
        window.location.reload();
      } else {
        authAPIClient.logout();
        setAuthenticatedUser(null);
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      window.alert(err);
    }
  };

  const cancelChanges = () => {
    setTempFullName(fullName);
    setTempEmail(email);
    setTempEducationalQualification(
      additionalExperiences?.educationalQualification
        ? additionalExperiences?.educationalQualification
        : "",
    );
    setTempLanguageExperience(
      additionalExperiences?.languageExperience
        ? additionalExperiences?.languageExperience
        : "",
    );
  };

  const filterStyle = useStyleConfig("Filter");

  if (loading) return <div />;
  if (error) return <Redirect to="/404" />;

  return (
    <Flex direction="column" height="100vh">
      <Box backgroundColor="white" position="fixed" width="100%" zIndex="1000">
        <Header />
      </Box>
      <Box paddingTop="64px">
        <Flex
          backgroundColor="white"
          height="100%"
          position="fixed"
          sx={filterStyle}
          width="400px"
          zIndex="100"
        >
          <Heading size="lg">{fullName}</Heading>
          <Heading size="sm" marginTop="36px">
            Role(s)
          </Heading>
          <Text>{role}</Text>
          <Heading size="sm" marginTop="36px">
            Email
          </Heading>
          <Text>{email}</Text>
          {isAdmin && resumeId && (
            <>
              <Heading size="sm" marginTop="36px">
                User Files
              </Heading>
              <Button variant="link" onClick={() => downloadFile(resumeId)}>
                {`${resumeFileName}`}
              </Button>
            </>
          )}
        </Flex>
        <Flex direction="column" margin="40px 40px 40px 440px">
          {!isAdmin && (
            <Box>
              <UserProfileForm
                email={tempEmail}
                experience={tempLanguageExperience}
                fullName={tempFullName}
                isSignup={false}
                qualifications={tempEducationalQualification}
                setEducationalQualification={setTempEducationalQualification}
                setEmail={setTempEmail}
                setFullName={setTempFullName}
                setLanguage={() => {}}
                setLanguageExperience={setTempLanguageExperience}
                updateResume={updateResume}
              />
              <Flex marginTop="35px">
                <Button
                  colorScheme="blue"
                  marginRight="20px"
                  onClick={cancelChanges}
                  variant="blueOutline"
                >
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={openSaveChangesModal}>
                  Save Changes
                </Button>
              </Flex>
            </Box>
          )}
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
                message={getMessageFromStoryAssignStage(storyAssignStage)}
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
                onClick={openModal}
              >
                Delete User
              </Button>
            </>
          )}
        </Flex>
      </Box>
      {confirmDeleteUser && (
        <ConfirmationModal
          confirmation={confirmDeleteUser}
          onClose={closeModal}
          onConfirmationClick={callSoftDeleteUserMutation}
          confirmationMessage={MANAGE_USERS_TABLE_DELETE_USER_CONFIRMATION}
          buttonMessage={MANAGE_USERS_TABLE_DELETE_USER_BUTTON}
        />
      )}
      {confirmSaveChanges && (
        <ConfirmationModal
          buttonMessage={USER_PROFILE_PAGE_SAVE_CHANGES_BUTTON}
          confirmation={confirmSaveChanges}
          confirmationMessage={USER_PROFILE_PAGE_SAVE_CHANGES_CONFIRMATION}
          onClose={closeSaveChangesModal}
          onConfirmationClick={saveChanges}
        />
      )}
    </Flex>
  );
};

export default UserProfilePage;
