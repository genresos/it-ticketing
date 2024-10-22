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

const NeedPermission = () => {
  const { signOut } = useContext(AuthContext);
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
          403
        </Heading>
        <Text fontSize="24px" fontWeight="bold" color={textColor} mt={3} mb={2}>
          FORBIDDEN!
        </Text>
        <Text color={"gray.500"}>
          You don&apos;t have permission! If you think you have this access,
        </Text>
        <Text color={"gray.500"} mb={6}>
          please contact the Administrator.
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

export default withAuth(NeedPermission);
