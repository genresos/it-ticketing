import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { IconType } from "react-icons";
import { CurrentIssues, DataIssues } from "../../types/dataList";
import MyTable from "../Table/MyTable";
import {
  FaMagic,
  FaUserCheck,
  FaCheck,
  FaBusinessTime,
  FaClipboardCheck,
  FaFolderOpen,
  FaDoorClosed,
} from "react-icons/fa";
import { myDateFormat, myNumberFormat } from "../../utils/myFormat";
import { FiSearch } from "react-icons/fi";
import { useGetFilterList, useSearchDebounce } from "../../hooks";
import { CardTitle } from "../Card";
import { initialDataIssue } from "../../utils/initialDataIssue";
import ModalDetailsCurrentIssue from "../Issues/ModalDetailsCurrentIssue";

interface Props {
  data: CurrentIssues;
}

const newColor = "rgba(0, 117, 143, 1)";
const secondColor = "#ffac4c";
const successColor = "rgba(85, 198, 170, 1)";
const gradBlue1 = "#136ABD";
const gradOrange1 = "#D56425";
const gradPurple1 = "#5E22BD";
const closeColor = "rgba(128, 128, 128, 1)";

const TableCurrentIssue = ({ data }: Props) => {
  const textColor = useColorModeValue("gray.700", "white");

  const [dataTemp, setDataTemp] = useState<DataIssues>(initialDataIssue);
  const [filterData, setFilterData] = useState("");
  const [searchData, setSearchData] = useState("");
  const { dataSearch } = useSearchDebounce(searchData, 800);

  const {
    isOpen: isDetails,
    onOpen: openDetails,
    onClose: closeDetails,
  } = useDisclosure();

  const statusList = useGetFilterList(data.issue, "status");

  const newData = useMemo<DataIssues[]>(() => {
    if (data.issue.length === 0) {
      return [];
    }

    const newVal = [...data.issue]
      .filter((item) => item.status_id.includes(filterData))
      .filter(
        (val) =>
          val.requestor.toLowerCase().includes(dataSearch.toLowerCase()) ||
          val.title.toLowerCase().includes(dataSearch.toLowerCase()) ||
          val.description.toLowerCase().includes(dataSearch.toLowerCase())
      );

    return newVal;
  }, [data, filterData, dataSearch]);

  const columns = useMemo<ColumnDef<DataIssues, any>[]>(
    () => [
      {
        accessorKey: "requestor",
        header: () => "Requestor",
        cell: (info) => (
          <Box
            minW="120px"
            onClick={() => {
              setDataTemp(info.row.original);
              openDetails();
            }}
            cursor="pointer"
          >
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {info.getValue()}
            </Text>
          </Box>
        ),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "title",
        header: () => "Title",
        cell: (info) => (
          <Box
            minW="120px"
            onClick={() => {
              setDataTemp(info.row.original);
              openDetails();
            }}
            cursor="pointer"
          >
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {info.getValue()}
            </Text>
          </Box>
        ),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "asset_name",
        header: () => "No Asset",
        cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "project_code",
        header: () => "Project Code",
        cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "assigned_to",
        header: () => "Assign",
        cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "category_id",
        header: () => "Category",
        cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status_id",
        header: () => "Status",
        cell: (info) => {
          let isStatus: { bg: string; icon: IconType };
          const valStatus = info.getValue();

          if (valStatus === "New") {
            isStatus = { bg: newColor, icon: FaMagic };
          } else if (valStatus === "Assigned") {
            isStatus = { bg: secondColor, icon: FaUserCheck };
          } else if (valStatus === "Resovled") {
            isStatus = { bg: successColor, icon: FaCheck };
          } else if (valStatus === "Deployed") {
            isStatus = { bg: gradBlue1, icon: FaBusinessTime };
          } else if (valStatus === "Verified") {
            isStatus = { bg: gradOrange1, icon: FaClipboardCheck };
          } else if (valStatus === "Reopened") {
            isStatus = { bg: gradPurple1, icon: FaFolderOpen };
          } else {
            isStatus = { bg: closeColor, icon: FaDoorClosed };
          }

          return (
            <Button
              leftIcon={<isStatus.icon />}
              bg={isStatus.bg}
              color="white"
              variant="solid"
              size={"sm"}
              borderRadius={20}
              cursor="default"
              _hover={{ bg: isStatus.bg }}
              _active={{ bg: isStatus.bg }}
            >
              {info.getValue()}
            </Button>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "created_time",
        header: () => "Date",
        cell: (info) => (
          <Text fontSize="sm" minW="100px">
            {myDateFormat(info.getValue())}
          </Text>
        ),
        footer: (props) => props.column.id,
      },
    ],
    [textColor, openDetails]
  );

  return (
    <Box>
      <ModalDetailsCurrentIssue
        visible={isDetails}
        onClose={closeDetails}
        data={dataTemp}
      />
      <CardTitle
        title="Current Task Issue"
        value={`${myNumberFormat(data.issue.length)} issues`}
        label="have been registered."
      />
      <HStack justifyContent={"space-between"} mb={4}>
        <Flex>
          <InputGroup size={"lg"}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="search.."
              fontSize={"sm"}
              borderRadius="15px"
              value={searchData}
              onChange={(val) => setSearchData(val.target.value)}
            />
          </InputGroup>
        </Flex>
        <Flex>
          <Select
            placeholder="All Status"
            size={"lg"}
            borderRadius="15px"
            fontSize={"sm"}
            value={filterData}
            onChange={(val) => setFilterData(val.target.value)}
          >
            {statusList.map((item) => (
              <option key={item.value} value={item.value}>
                {item.text}
              </option>
            ))}
          </Select>
        </Flex>
      </HStack>
      <MyTable
        pagination="client"
        data={newData}
        columns={columns}
        firstId="requestor"
        loading={false}
        loadingSpan={columns.length}
      />
    </Box>
  );
};

export default TableCurrentIssue;
