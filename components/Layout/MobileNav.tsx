import {
  Flex,
  FlexProps,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { MdApps } from "react-icons/md";
import { ThemeToggleButton } from "../Main";
import LogoAdw from "./LogoAdw";

interface Props extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: Props) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      pos="fixed"
      w="100%"
      bg={useColorModeValue("#ffffff20", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      style={{ backdropFilter: "blur(10px)" }}
      zIndex="99"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<MdApps />}
      />
      <LogoAdw />
      <ThemeToggleButton />
    </Flex>
  );
};

export default MobileNav;
