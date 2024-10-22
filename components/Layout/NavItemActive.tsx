import {
  Button,
  ButtonProps,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { IconBox } from "../Main";

interface Props extends ButtonProps {
  children: string;
  icon: IconType | null;
}

const NavItemActive = ({ children, icon, ...rest }: Props) => {
  return (
    <Button
      boxSize="initial"
      justifyContent="flex-start"
      alignItems="center"
      bg={useColorModeValue("white", "gray.700")}
      mb={{
        xl: "12px",
      }}
      mx={{
        xl: "auto",
      }}
      ps={{
        sm: "10px",
        xl: "16px",
      }}
      py="12px"
      borderRadius="15px"
      _hover={{
        bg: useColorModeValue("white", "gray.700"),
      }}
      w="100%"
      _active={{
        bg: "inherit",
        transform: "none",
        borderColor: "transparent",
      }}
      _focus={{
        boxShadow: "lg",
      }}
      boxShadow="xl"
      {...rest}
    >
      <Flex ml={{ base: "10px", md: "0" }}>
        <IconBox bg="teal.300" color="white" h="30px" w="30px" me="12px">
          {icon ? <Icon fontSize="16" as={icon} /> : null}
        </IconBox>
        <Text
          color={useColorModeValue("gray.700", "white")}
          my="auto"
          fontSize="md"
          fontWeight="bold"
        >
          {children}
        </Text>
      </Flex>
    </Button>
  );
};

export default NavItemActive;
