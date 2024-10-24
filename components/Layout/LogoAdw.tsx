import {
  Box,
  Link,
  Image,
  useColorModeValue,
  Text,
  BoxProps,
} from "@chakra-ui/react";
import React from "react";

const LogoAdw = ({ ...rest }: BoxProps) => {
  return (
    <Box {...rest}>
      <Link
        href="/dashboard"
        target="_self"
        display="flex"
        lineHeight="100%"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        _active={{
          boxShadow: "none",
        }}
        _focus={{
          boxShadow: "none",
        }}
        style={{ textDecoration: "none" }}
      >
        <Image
          src={`/adw-favicon${useColorModeValue("-bw", "")}.png`}
          maxW={{ base: "20px", md: "40px" }}
          alt="logo"
          mr={{ base: "6px", md: "10px" }}
        />
        <Text fontSize={{ base: "sm", md: "md" }} mt="3px">
          IT TICKETING SYSTEM
        </Text>
      </Link>
    </Box>
  );
};

export default LogoAdw;
