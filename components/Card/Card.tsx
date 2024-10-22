import { Box, useColorModeValue, BoxProps } from "@chakra-ui/react";

interface Props extends BoxProps {
  children: React.ReactNode;
}

const Card = ({ children, ...rest }: Props) => {
  return (
    <Box
      p="20px"
      bg={useColorModeValue("white", "gray.700")}
      borderRadius="20px"
      boxShadow="sm"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;
