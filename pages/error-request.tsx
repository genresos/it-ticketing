import { useContext } from "react";
import NextLink from "next/link";
import {
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { AuthContext } from "../store/AuthContext";
import withAuth from "../HOC/withAuth";
import { useRouter } from "next/router";

const ErrorRequest = () => {
  const { signOut } = useContext(AuthContext);
  const textColor = useColorModeValue("gray.700", "white");
  const {query} = useRouter();
  
  return (
    <Flex w="full" minH="90vh" flexDir="column" justifyContent="center">
      <Flex py={10} px={6} alignItems="center" flexDir="column">
        <Heading
          display="inline-block"
          as="h2"
          size="lg"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          Woops
        </Heading>
        <Text fontSize="48px" fontWeight="bold" color={textColor} mb={2}>
          {query?.error}
        </Text>
        <Text color={"gray.500"} mb={6}>
          {query?.message}
        </Text>
        <Stack spacing={6} direction={"row"}>
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
          <Button
            rounded={"full"}
            px={6}
            variant="solid"
            minW="170px"
            onClick={signOut}
          >
            Logout
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default withAuth(ErrorRequest);
