import {
  Box,
  BoxProps,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

interface Props extends BoxProps {
  title: string;
  value: string;
  label: string;
  isDark?: boolean;
  extra?: React.ReactNode;
}

const CardTitle = ({ title, value, label, isDark, extra }: Props) => {
  const textColor = useColorModeValue(isDark ? "white" : "gray.700", "white");
  return (
    <Box>
      <Box mb="6px">
        <Text fontSize="lg" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </Box>
      <HStack justifyContent="space-between" mb="28px">
        <HStack>
          <Icon as={IoCheckmarkDoneCircleSharp} color="teal.300" w={4} h={4} />
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            <Text fontWeight="bold" as="span">
              {value}
            </Text>{" "}
            {label}
          </Text>
        </HStack>
        <Box>{extra ? extra : null}</Box>
      </HStack>
    </Box>
  );
};

export default CardTitle;
