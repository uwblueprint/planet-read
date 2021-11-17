import React, { useContext, useState } from "react";
import { Button, Flex, Heading, IconButton, Image } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdOutlineAccountCircle } from "react-icons/md";
import Logo from "../../assets/planet-read-logo.svg";
import UserModal from "./UserModal";
import AuthContext from "../../contexts/AuthContext";

export enum AdminPageOption {
  StoryTranslations = 1,
  Translators,
  Reviewers,
}

export type HeaderProps = {
  title?: string;
  adminPageOption?: AdminPageOption;
  setAdminPageOption?: (val: AdminPageOption) => void;
};

const Header = ({
  title,
  adminPageOption,
  setAdminPageOption,
}: HeaderProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  const { id, firstName, lastName, role, approvedLanguagesReview } =
    authenticatedUser!!;

  const isReviewer = approvedLanguagesReview !== null;

  const [showUser, setShowUser] = useState(false);

  const onProfileClick = () => {
    setShowUser(true);
  };

  const onCloseUserModal = () => {
    setShowUser(false);
  };

  return (
    <Flex
      justify="space-between"
      alignItems="stretch"
      boxShadow="0px -9px 10px black"
    >
      <Flex margin="0px 30px">
        <Heading size="md" margin="10px">
          Add my Language
        </Heading>
        <Image width="40px" src={Logo} alt="Planet read logo" />
      </Flex>

      {title && (
        <Heading size="lg" margin="10px">
          {title}
        </Heading>
      )}
      {adminPageOption && setAdminPageOption && (
        <Flex alignItems="flex-end">
          <Button
            variant={
              adminPageOption === AdminPageOption.StoryTranslations
                ? "headerSelect"
                : "header"
            }
            onClick={() => {
              setAdminPageOption(AdminPageOption.StoryTranslations);
            }}
          >
            Manage Story Translations
          </Button>
          <Button
            variant={
              adminPageOption === AdminPageOption.Translators
                ? "headerSelect"
                : "header"
            }
            onClick={() => setAdminPageOption(AdminPageOption.Translators)}
          >
            Manage Translators
          </Button>
          <Button
            variant={
              adminPageOption === AdminPageOption.Reviewers
                ? "headerSelect"
                : "header"
            }
            onClick={() => setAdminPageOption(AdminPageOption.Reviewers)}
          >
            Manage Reviewers
          </Button>
        </Flex>
      )}
      <Flex
        width="300px"
        marginRight="30px"
        justify="flex-end"
        alignItems="center"
      >
        <IconButton
          width="fit-content"
          aria-label="User icon"
          background="transparent"
          icon={<Icon as={MdOutlineAccountCircle} width={6} height={6} />}
          onClick={() => onProfileClick()}
        />
      </Flex>
      {showUser && (
        <UserModal
          showUser={showUser}
          onClose={onCloseUserModal}
          id={id}
          firstName={firstName}
          lastName={lastName}
          role={role}
          isReviewer={isReviewer}
        />
      )}
    </Flex>
  );
};

export default Header;
