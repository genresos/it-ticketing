import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import linkItems from "./linkItems";
import LogoAdw from "./LogoAdw";
import NavItemTitle from "./NavItemTitle";
import NavItemActive from "./NavItemActive";
import NavItemInactive from "./NavItemInactive";
import { MdLogout } from "react-icons/md";

interface Props extends BoxProps {
  onClose: () => void;
}

const SidebarContentMobile = ({ onClose, ...rest }: Props) => {
  const locationPath = useRouter().pathname;
  const { signOut } = useContext(AuthContext);
  return (
    <Box w="xs" pos="fixed" h="full" p={4} {...rest}>
      <Box
        bg={useColorModeValue("#ffffff20", "gray.900")}
        border="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        h="100%"
        ps="20px"
        pe="20px"
        borderRadius={20}
        style={{ backdropFilter: "blur(10px)" }}
        overflow="scroll"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <LogoAdw />
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        {linkItems.map((link) =>
          link.link === "#" ? (
            <NavItemTitle key={link.id}>{link.name}</NavItemTitle>
          ) : (
            <NextLink key={link.id} href={link.link}>
              {link.link === locationPath ? (
                <NavItemActive icon={link.icon}>{link.name}</NavItemActive>
              ) : (
                <NavItemInactive icon={link.icon} onClose={onClose}>
                  {link.name}
                </NavItemInactive>
              )}
            </NextLink>
          )
        )}
        <Flex
          onClick={() => {
            signOut();
          }}
        >
          <NavItemInactive icon={MdLogout}>Logout</NavItemInactive>
        </Flex>
      </Box>
    </Box>
  );
};

export default SidebarContentMobile;
