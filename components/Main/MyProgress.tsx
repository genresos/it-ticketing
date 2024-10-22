import { Box, BoxProps, Progress } from "@chakra-ui/react";

interface Props extends BoxProps {
  loadings: boolean[];
}

const MyProgress = ({ loadings }: Props) => {
  return (
    <Box>
      {loadings.indexOf(true) !== -1 ? (
        <Progress
          size="xs"
          colorScheme="teal"
          borderRadius={10}
          isIndeterminate
        />
      ) : (
        <Box h={1} />
      )}
    </Box>
  );
};

export default MyProgress;
