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
  Stories,
  Translators,
  Reviewers,
  Tests,
}

type AdminPageOptionPair = {
  op: AdminPageOption;
  str: String;
};

const AdminPageOptionToStr = [
  { op: AdminPageOption.StoryTranslations, str: "Story Translations" },
  { op: AdminPageOption.Stories, str: "Stories" },
  { op: AdminPageOption.Translators, str: "Translators" },
  { op: AdminPageOption.Reviewers, str: "Reviewers" },
  { op: AdminPageOption.Tests, str: "Tests" },
];

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

  const adminTabs =
    adminPageOption &&
    setAdminPageOption &&
    AdminPageOptionToStr.map((adminPageOp: AdminPageOptionPair) => (
      <Button
        onClick={() => {
          setAdminPageOption(adminPageOp.op);
        }}
        variant={adminPageOption === adminPageOp.op ? "headerSelect" : "header"}
      >
        Manage {adminPageOp.str}
      </Button>
    ));

  return (
    <Flex
      alignItems="stretch"
      boxShadow="0px -9px 10px black"
      justify="space-between"
    >
      <Flex margin="0px 30px">
        <Link
          href="#/"
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
        <Flex alignItems="flex-end">{adminTabs}</Flex>
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
