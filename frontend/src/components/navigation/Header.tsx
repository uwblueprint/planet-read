import React, { useContext, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
} from "@chakra-ui/react";
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
      alignItems="stretch"
      boxShadow="0px -9px 10px black"
      justify="space-between"
    >
      <Flex margin="0px 30px">
        <Link
          href="/"
          textDecoration="none"
          _hover={{ textDecoration: "none", color: "black" }}
        >
          <Heading margin="10px" size="md">
            Add my Language
          </Heading>
        </Link>
        <Image alt="Planet read logo" src={Logo} width="40px" />
      </Flex>

      {title && (
        <Heading margin="10px" size="lg">
          {title}
        </Heading>
      )}
      {adminPageOption && setAdminPageOption && (
        <Flex alignItems="flex-end">
          <Button
            onClick={() => {
              setAdminPageOption(AdminPageOption.StoryTranslations);
            }}
            variant={
              adminPageOption === AdminPageOption.StoryTranslations
                ? "headerSelect"
                : "header"
            }
          >
            Manage Story Translations
          </Button>
          <Button
            onClick={() => setAdminPageOption(AdminPageOption.Translators)}
            variant={
              adminPageOption === AdminPageOption.Translators
                ? "headerSelect"
                : "header"
            }
          >
            Manage Translators
          </Button>
          <Button
            onClick={() => setAdminPageOption(AdminPageOption.Reviewers)}
            variant={
              adminPageOption === AdminPageOption.Reviewers
                ? "headerSelect"
                : "header"
            }
          >
            Manage Reviewers
          </Button>
        </Flex>
      )}
      <Flex
        alignItems="center"
        justify="flex-end"
        marginRight="30px"
        width="300px"
      >
        <IconButton
          aria-label="User icon"
          background="transparent"
          icon={<Icon as={MdOutlineAccountCircle} width={6} height={6} />}
          onClick={() => onProfileClick()}
          width="fit-content"
        />
      </Flex>
      {showUser && (
        <UserModal
          firstName={firstName}
          id={id}
          isReviewer={isReviewer}
          lastName={lastName}
          onClose={onCloseUserModal}
          role={role}
          showUser={showUser}
        />
      )}
    </Flex>
  );
};

export default Header;
