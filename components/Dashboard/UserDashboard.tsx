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
import { AuthContext } from "../../store/AuthContext";

const UserDashboard = () => {
  const { userData } = useContext(AuthContext);
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Flex w="full" minH="74vh" flexDir="column" justifyContent="center">
      <Flex py={10} px={6} alignItems="center" flexDir="column">
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          WELCOME
        </Heading>
        <Text
          fontSize="24px"
          fontWeight="bold"
          color={textColor}
          mt={3}
          mb={2}
          textTransform="capitalize"
        >
          {userData.name}
        </Text>
        <Text color={"gray.500"}>
          Welcome to IT Ticketing System, would you like to
        </Text>
        <Text color={"gray.500"} mb={6}>
          report an issue now?
        </Text>

        <Stack spacing={6} direction={"row"}>
          <NextLink href="/dashboard/add-issue">
            <Button
              rounded="full"
              px={6}
              colorScheme="teal"
              bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
              color="white"
              variant="solid"
              minW="170px"
            >
              Add Issue
            </Button>
          </NextLink>
          <NextLink href="/dashboard/issues">
            <Button rounded="full" px={6} variant="solid" minW="170px">
              History Issue
            </Button>
          </NextLink>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default UserDashboard;
