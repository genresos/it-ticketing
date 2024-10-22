import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { BsFolderX } from "react-icons/bs";

interface Props {
  title?: string;
  message?: string;
}

const NoDataFound = ({ title, message }: Props) => {
  return (
    <Flex
      bg={useColorModeValue("gray.100", "gray.800")}
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      minH={140}
      p={4}
      color="gray.400"
    >
      <Icon as={BsFolderX} boxSize={10} />
      <Text fontSize="lg">{title || "No Data Found"}</Text>
      {message && <Text fontSize="sm">{message}</Text>}
    </Flex>
  );
};

export default NoDataFound;
