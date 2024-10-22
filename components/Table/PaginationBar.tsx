import {
  Box,
  Flex,
  FlexProps,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import React from "react";
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
  perPage: number;
  onFirstPage: () => void;
  disableFirstPage: boolean;
  onPrevPage: () => void;
  disablePrevPage: boolean;
  onNextPage: () => void;
  disableNextPage: boolean;
  onLastPage: () => void;
  disableLastPage: boolean;
  onGoToPage: React.ChangeEventHandler<HTMLInputElement>;
  onPerPage: React.ChangeEventHandler<HTMLSelectElement>;
}

const PaginationBar = ({
  totalData,
  currentPage,
  totalPage,
  page,
  perPage,
  onFirstPage,
  disableFirstPage,
  onPrevPage,
  disablePrevPage,
  onNextPage,
  disableNextPage,
  onLastPage,
  disableLastPage,
  onGoToPage,
  onPerPage,
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
        <Flex flexDir="row" alignItems="center" mr="20px" mb="20px">
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
        <FormControl>
          <HStack mb="24px">
            <Flex
              flexDir={{ base: "column", md: "row" }}
              alignItems={{ base: "start", md: "center" }}
            >
              <FormLabel fontSize="sm" fontWeight="normal">
                Go to page:
              </FormLabel>
              <Input
                borderRadius="15px"
                fontSize="sm"
                type="number"
                placeholder="Go to page"
                size="lg"
                maxW="100px"
                maxLength={4}
                id="goToPage"
                defaultValue={page}
                onChange={onGoToPage}
              />
            </Flex>
            <Flex
              flexDir={{ base: "column", md: "row" }}
              alignItems={{ base: "start", md: "center" }}
            >
              <FormLabel fontSize="sm" fontWeight="normal">
                Show:
              </FormLabel>
              <Select
                borderRadius="15px"
                fontSize="sm"
                size="lg"
                id="showData"
                value={perPage}
                onChange={onPerPage}
              >
                {[10, 20, 30, 50, 80].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Select>
            </Flex>
          </HStack>
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default PaginationBar;
