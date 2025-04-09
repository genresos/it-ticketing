import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useMemo, useState } from "react";
import {
  getIssueIctCategory,
  getIssueIctStatus,
  getMyIssueICT,
} from "../../utils/fetchApi";
import { AxiosError } from "axios";
import { ErrorResponseAPI } from "../../types/error";
import { myError, myErrorSSR } from "../../utils/myError";
import { DataIssueICT, ListGeneral } from "../../types/dataList";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../store/AuthContext";
import Navbar from "../../components/Navbar";
import { Card, CardBody, CardHeader } from "../../components/Card";
import { FiSearch } from "react-icons/fi";
import {
  FaBusinessTime,
  FaCheck,
  FaClipboardCheck,
  FaDoorClosed,
  FaEllipsisV,
  FaFolderOpen,
  FaMagic,
  FaUserCheck,
} from "react-icons/fa";
import { useGetFilterList, useSearchDebounce } from "../../hooks";
import { ColumnDef } from "@tanstack/react-table";
import { IconType } from "react-icons";
import MyTable from "../../components/Table/MyTable";
import { myDateFormat } from "../../utils/myFormat";
import ModalDetailTask from "../../components/MyTask/ModalDetailTask";
import ModalUpdateTask from "../../components/MyTask/ModalUpdateTask";
import { initialDataIssueICT } from "../../utils/initialDataIssue";
import withAuth from "../../HOC/withAuth";

interface Props {
  dataMyTask: DataIssueICT[];
  ticketStatus: ListGeneral[];
  ticketCategory: ListGeneral[];
}

const newColor = "rgba(0, 117, 143, 1)";
const secondColor = "#ffac4c";
const successColor = "rgba(85, 198, 170, 1)";
const gradBlue1 = "#136ABD";
const gradOrange1 = "#D56425";
const gradPurple1 = "#5E22BD";
const closeColor = "rgba(128, 128, 128, 1)";

const MyTask: NextPage<Props> = ({
  dataMyTask,
  ticketStatus,
  ticketCategory,
}) => {
  const textColor = useColorModeValue("gray.700", "white");
  const { userToken, signOut } = useContext(AuthContext);

  const [dataTemp, setDataTemp] = useState<DataIssueICT>(initialDataIssueICT);
  const [filterData, setFilterData] = useState("");
  const [searchData, setSearchData] = useState("");
  const { dataSearch } = useSearchDebounce(searchData, 800);

  const toast = useToast();

  const {
    isOpen: isUpdate,
    onOpen: openUpdate,
    onClose: closeUpdate,
  } = useDisclosure();
  const {
    isOpen: isDetails,
    onOpen: openDetails,
    onClose: closeDetails,
  } = useDisclosure();

  const { data, isSuccess, isFetching, refetch } = useQuery<
    DataIssueICT[],
    AxiosError<ErrorResponseAPI>
  >(["get-my-task"], () => getMyIssueICT(userToken), {
    enabled: userToken ? true : false,
    initialData: dataMyTask,
    onSuccess: (dataSuccess) =>
      console.log("success my task: ", dataSuccess.length),
    onError: (err) => myError(err, toast, signOut),
  });

  const statusList = useGetFilterList(isSuccess ? data : [], "status_id");

  const newData = useMemo<DataIssueICT[]>(() => {
    if (!isSuccess) {
      return [];
    }

    if (data.length === 0) {
      return [];
    }

    const newVal = [...data]
      .filter((item) => item.status_id.includes(filterData))
      .filter(
        (val) =>
          val.requestor.toLowerCase().includes(dataSearch.toLowerCase()) ||
          val.title.toLowerCase().includes(dataSearch.toLowerCase()) ||
          val.asset_name?.toLowerCase().includes(dataSearch.toLowerCase()) ||
          val.project_code?.toLowerCase().includes(dataSearch.toLowerCase()) ||
          val.description.toLowerCase().includes(dataSearch.toLowerCase())
      );

    return newVal;
  }, [data, isSuccess, filterData, dataSearch]);

  const columns = useMemo<ColumnDef<DataIssueICT, any>[]>(
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
        cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
        footer: (props) => props.column.id,
      },
      // {
      //   accessorKey: "description",
      //   header: () => "Remark",
      //   cell: (info) => (
      //     <Text fontSize="sm" fontWeight={"light"} noOfLines={2}>
      //       {info.getValue()}
      //     </Text>
      //   ),
      //   footer: (props) => props.column.id,
      // },
      {
        accessorKey: "asset_name",
        header: () => "No Asset",
        cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
        footer: (props) => props.column.id,
      },
      // {
      //   accessorKey: "project_code",
      //   header: () => "Project Code",
      //   cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
      //   footer: (props) => props.column.id,
      // },
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
              _hover={{ bg: isStatus.bg }}
              _active={{
                bg: isStatus.bg,
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                bg: isStatus.bg,
                transform: "none",
                borderColor: "transparent",
              }}
              onClick={() => {
                setDataTemp(info.row.original);
                openUpdate();
              }}
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
      {
        accessorKey: "accepted_time",
        header: () => "Action",
        cell: (info) => (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="more-action"
              icon={<FaEllipsisV />}
              variant="ghost"
              color="gray.400"
            />
            <MenuList>
              <MenuItem
                onClick={() => {
                  setDataTemp(info.row.original);
                  openDetails();
                }}
              >
                Details
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setDataTemp(info.row.original);
                  openUpdate();
                }}
              >
                Update
              </MenuItem>
            </MenuList>
          </Menu>
        ),
        footer: (props) => props.column.id,
      },
    ],
    [textColor, openDetails, openUpdate]
  );

  return (
    <Box>
      <ModalDetailTask
        visible={isDetails}
        onClose={closeDetails}
        data={dataTemp}
        onUpdate={openUpdate}
      />
      <ModalUpdateTask
        visible={isUpdate}
        onClose={closeUpdate}
        data={dataTemp}
        ticketStatus={ticketStatus}
        ticketCategory={ticketCategory}
        onFinish={() => {
          closeDetails();
          refetch();
        }}
      />
      <Navbar
        title="MY TASK"
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href="/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>My Task</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      >
        <Card>
          <CardHeader mt="6px" mb="22px">
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              Task Issue Lists
            </Text>
          </CardHeader>
          <CardBody id="top_section">
            <HStack justifyContent={"space-between"}>
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
            <Box mt={10}>
              <MyTable
                pagination="client"
                data={newData}
                columns={columns}
                firstId="requestor"
                loading={isFetching}
                loadingSpan={columns.length}
                disbleTableId
              />
            </Box>
          </CardBody>
        </Card>
      </Navbar>
    </Box>
  );
};

export default withAuth(MyTask);

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const { ictAuth } = req.cookies;

  if (!ictAuth) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
    };
  }

  try {
    const [ticketStatus, ticketCategory, dataMyTask] = await Promise.all([
      getIssueIctStatus(ictAuth),
      getIssueIctCategory(ictAuth),
      getMyIssueICT(ictAuth),
    ]);

    return {
      props: { dataMyTask, ticketStatus, ticketCategory },
    };
  } catch (err) {
    return myErrorSSR<any>(err as AxiosError<ErrorResponseAPI>);
  }
};
