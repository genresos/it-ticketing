import { Box, BoxProps } from "@chakra-ui/react";

interface Props extends BoxProps {
  children: React.ReactNode;
}

const CardBody = ({ children, ...rest }: Props) => {
  return <Box {...rest}>{children}</Box>;
};

export default CardBody;
