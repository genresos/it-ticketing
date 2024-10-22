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
  onClose?: () => void;
}

const NavItemInactive = ({ children, icon, onClose, ...rest }: Props) => {
  return (
    <Button
      boxSize="initial"
      justifyContent="flex-start"
      alignItems="center"
      bg="transparent"
      mb={{
        xl: "12px",
      }}
      mx={{
        xl: "auto",
      }}
      py="12px"
      ps={{
        sm: "10px",
        xl: "16px",
      }}
      borderRadius="15px"
      _hover={{
        bg: "none",
      }}
      w="100%"
      _active={{
        bg: "inherit",
        transform: "none",
        borderColor: "transparent",
      }}
      _focus={{
        boxShadow: "none",
      }}
      onClick={onClose}
      {...rest}
    >
      <Flex>
        <IconBox
          bg={useColorModeValue("white", "gray.700")}
          color="teal.300"
          h="30px"
          w="30px"
          me="12px"
          transition="0.2s linear"
        >
          {icon ? <Icon fontSize="16" as={icon} /> : null}
        </IconBox>
        <Text
          color={useColorModeValue("gray.400", "gray.400")}
          my="auto"
          fontSize="md"
        >
          {children}
        </Text>
      </Flex>
    </Button>
  );
};

export default NavItemInactive;
