import React from "react";
import { Flex, Spinner, useColorModeValue, Image } from "@chakra-ui/react";
import { Card } from "../Card";

const Spalsh = () => {
  return (
    <Flex h="100vh" alignItems="center" justifyContent="center">
      <Card>
        <Flex
          w={{ base: "70px", md: "80px" }}
          h={{ base: "70px", md: "80px" }}
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Flex flexDir="column" alignItems="center" mb="16px" mt="10px">
            <Image
              src={`/Logo-adw-min${useColorModeValue("", "-white")}.png`}
              maxW={{ base: "60px", md: "70px" }}
              maxH={{ base: "60px", md: "70px" }}
              objectFit="contain"
              alt="logo"
            />
          </Flex>
          <Spinner color={useColorModeValue("#055f9d", "teal.300")} size="sm" />
        </Flex>
      </Card>
    </Flex>
  );
};

export async function getStaticProps() {
  return {
    props: {
      layoutType: "Auth",
    },
  };
}

export default Spalsh;
