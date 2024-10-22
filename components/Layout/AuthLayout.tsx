import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      {children}
    </Box>
  );
};

export default AuthLayout;
