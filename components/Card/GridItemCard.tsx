import { GridItem, GridItemProps, useColorModeValue } from "@chakra-ui/react";
import React from "react";

interface Props extends GridItemProps {
  children: React.ReactNode;
  isDark?: boolean;
}

const darkBg = "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)";

const GridItemCard = ({ children, isDark, ...rest }: Props) => {
  return (
    <GridItem
      bg={useColorModeValue(
        isDark ? darkBg : "white",
        isDark ? darkBg : "gray.700"
      )}
      borderRadius="20px"
      boxShadow="sm"
      p="20px"
      {...rest}
    >
      {children}
    </GridItem>
  );
};

export default GridItemCard;
