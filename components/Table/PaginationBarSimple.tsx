import { Box, Flex, FlexProps, IconButton, Text } from "@chakra-ui/react";
import {
  MdOutlineChevronLeft,
  MdOutlineChevronRight,
  MdOutlineFirstPage,
  MdOutlineLastPage,
} from "react-icons/md";

interface Props extends FlexProps {
  totalData: number;
  currentPage: number;
  totalPage: number;
  page: number;
  onFirstPage: () => void;
  disableFirstPage: boolean;
  onPrevPage: () => void;
  disablePrevPage: boolean;
  onNextPage: () => void;
  disableNextPage: boolean;
  onLastPage: () => void;
  disableLastPage: boolean;
}

const PaginationBarSimple = ({
  totalData,
  currentPage,
  totalPage,
  page,
  onFirstPage,
  disableFirstPage,
  onPrevPage,
  disablePrevPage,
  onNextPage,
  disableNextPage,
  onLastPage,
  disableLastPage,
  ...rest
}: Props) => {
  return (
    <Flex
      flexDir={{ base: "column", md: "row" }}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent="space-between"
      {...rest}
    >
      <Text fontSize="sm" mb="20px">
        Total data: {totalData}
      </Text>
      <Flex flexDir={{ base: "column", md: "row" }}>
        <Flex flexDir="row" alignItems="center" mb="20px">
          <a href="#top_section">
            <IconButton
              aria-label="first-page"
              icon={<MdOutlineFirstPage />}
              height="30px"
              mx="4px"
              onClick={onFirstPage}
              disabled={disableFirstPage}
            />
          </a>
          <a href="#top_section">
            <IconButton
              aria-label="prev-page"
              icon={<MdOutlineChevronLeft />}
              height="30px"
              mx="4px"
              onClick={onPrevPage}
              disabled={disablePrevPage}
            />
          </a>
          <Box minW="80px">
            <Text textAlign="center" fontWeight="bold" mx="4px">
              {currentPage} of {totalPage}
            </Text>
          </Box>
          <a href="#top_section">
            <IconButton
              aria-label="next-page"
              icon={<MdOutlineChevronRight />}
              height="30px"
              mx="4px"
              onClick={onNextPage}
              disabled={disableNextPage}
            />
          </a>
          <a href="#top_section">
            <IconButton
              aria-label="last-page"
              icon={<MdOutlineLastPage />}
              height="30px"
              mx="4px"
              onClick={onLastPage}
              disabled={disableLastPage}
            />
          </a>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PaginationBarSimple;
