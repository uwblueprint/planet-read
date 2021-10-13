import React from "react";
import { Button, Flex, Heading, Image } from "@chakra-ui/react";
import Logo from "../../assets/planet-read-logo.svg";
import PlaceholderUserIcon from "../../assets/user-icon.svg";

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
      <Flex width="300px" justify="flex-end" margin="0px 30px">
        <Image width="40px" src={PlaceholderUserIcon} alt="User icon" />
      </Flex>
    </Flex>
  );
};

export default Header;
