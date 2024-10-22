import React from "react";
import { Flex, FlexProps } from "@chakra-ui/react";

interface Props extends FlexProps {
  children: React.ReactNode;
}

const Separator = ({ children, ...rest }: Props) => {
  return (
    <Flex
      h="1px"
      w="100%"
      bg="linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0) 100%)"
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default Separator;
