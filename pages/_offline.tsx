import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const Offline = () => {
  return (
    <Flex
      flexDir="column"
      minH="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="lg">You&apos;re Offline</Text>
    </Flex>
  );
};

export default Offline;

export async function getStaticProps() {
  return {
    props: {
      layoutType: "Auth",
    },
  };
}
