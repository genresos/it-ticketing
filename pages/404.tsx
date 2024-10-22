import NextLink from "next/link";
import {
  Flex,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import withAuth from "../HOC/withAuth";

const Custom404 = () => {
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Flex w="full" minH="90vh" flexDir="column" justifyContent="center">
      <Flex py={10} px={6} alignItems="center" flexDir="column">
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="24px" fontWeight="bold" color={textColor} mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={"gray.500"} mb={6}>
          Woops, Looks like this page doesn&apos;t exist.
        </Text>
        <NextLink href="/dashboard">
          <Button
            rounded="full"
            px={6}
            colorScheme="teal"
            bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
            color="white"
            variant="solid"
            minW="170px"
          >
            Go to Dashboard
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
};

export default withAuth(Custom404);
