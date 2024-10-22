import { Box, Text, TextProps, useColorModeValue } from "@chakra-ui/react";
import React from "react";

interface Props extends TextProps {
  label: string;
  value: string | number;
}

const ListDetails = ({ label, value, ...rest }: Props) => {
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Box mb="24px">
      <Text color={textColor} fontSize="sm" fontWeight="normal" mb="4px">
        {label}
      </Text>
      <Text color={textColor} fontSize={"lg"} fontWeight={"bold"} {...rest}>
        {value}
      </Text>
    </Box>
  );
};

export default ListDetails;
