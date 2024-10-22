import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import LayoutSeparator from "./LayoutSeparator";

const NavItemTitle = ({ children }: { children: string }) => {
  return (
    <Box>
      <Box mt={2} display={{ base: "none", md: "block" }}>
        <LayoutSeparator />
      </Box>
      <Box
        ps={{
          sm: "10px",
          xl: "16px",
        }}
        mt={4}
      >
        <Text
          color={useColorModeValue("gray.600", "gray.400")}
          my="auto"
          fontSize="lg"
          fontWeight="bold"
        >
          {children}
        </Text>
      </Box>
    </Box>
  );
};

export default NavItemTitle;
