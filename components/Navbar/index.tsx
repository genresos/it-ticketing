import React from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ThemeToggleButton } from "../Main";

interface Props {
  title: string;
  children: React.ReactNode;
  breadcrumb: React.ReactNode;
  addButtonNav?: React.ReactNode;
}

const Navbar = ({ title, children, addButtonNav, breadcrumb }: Props) => (
  <Box>
    <Flex
      position={{ base: "relative", md: "fixed" }}
      borderColor="transparent"
      backdropFilter="blur(21px)"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems="center"
      borderRadius="16px"
      display="flex"
      minH="75px"
      justifyContent="center"
      lineHeight="25.6px"
      mx="auto"
      mt="0px"
      pb="8px"
      right={{ base: 0, md: "10px" }}
      px={{
        base: 0,
        md: "30px",
      }}
      pt="8px"
      top="18px"
      w={{ sm: "calc(100vw - 30px)", md: "calc(100vw - 60px - 210px)" }}
      zIndex="96"
    >
      <Flex
        w="100%"
        flexDirection={{
          base: "column",
          md: "row",
        }}
        alignItems={{ md: "center" }}
      >
        <Box mb={{ sm: "8px", md: "0px" }}>
          <Text
            color={useColorModeValue("gray.700", "gray.200")}
            fontWeight="bold"
            fontSize={{ base: "md", md: "xl" }}
          >
            {title}
          </Text>
          {breadcrumb}
        </Box>
        <Box
          ms="auto"
          w={{ base: "100%", md: "unset" }}
          mt={{ base: 4, md: 0 }}
        >
          <Flex
            w={{ sm: "100%", md: "auto" }}
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box mr={2}>{addButtonNav}</Box>
            <Box display={{ base: "none", md: "block" }}>
              <ThemeToggleButton />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
    <Box pt={{ base: 6, md: 20 }} px={{ base: 0, md: 4 }}>
      {children}
    </Box>
  </Box>
);

export default Navbar;
