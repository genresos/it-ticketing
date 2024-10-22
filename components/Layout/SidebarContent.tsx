import { Box, BoxProps, Flex, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import LayoutSeparator from "./LayoutSeparator";
import linkItems from "./linkItems";
import LogoAdw from "./LogoAdw";
import NavItemTitle from "./NavItemTitle";
import NavItemActive from "./NavItemActive";
import NavItemInactive from "./NavItemInactive";
import { MdLogout } from "react-icons/md";

interface Props extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: Props) => {
  const locationPath = useRouter().pathname;
  const { signOut } = useContext(AuthContext);
  return (
    <Box
      display={{ base: "none", md: "block" }}
      position="fixed"
      h="full"
      overflow="scroll"
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
      {...rest}
    >
      <Box
        bg="none"
        transition="0.2s linear"
        w={60}
        pt={5}
        h="full"
        ps="20px"
        pe="20px"
      >
        <Box mb="20px">
          <LogoAdw pt={"25px"} mb="30px" />
          <LayoutSeparator />
        </Box>
        <Stack direction="column" mb="40px">
          {linkItems.map((link) =>
            link.link === "#" ? (
              <NavItemTitle key={link.id}>{link.name}</NavItemTitle>
            ) : (
              <NextLink key={link.id} href={link.link}>
                {link.link === locationPath ? (
                  <NavItemActive icon={link.icon}>{link.name}</NavItemActive>
                ) : (
                  <NavItemInactive icon={link.icon}>
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
        </Stack>
      </Box>
    </Box>
  );
};

export default SidebarContent;
