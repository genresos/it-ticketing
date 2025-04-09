import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  getIssueICT,
  getIssueIctCategory,
  getIssueIctStatus,
  getProjectWithSearch,
} from "../../utils/fetchApi";
import { AxiosError } from "axios";
import { ErrorResponseAPI } from "../../types/error";
import { myError, myErrorSSR } from "../../utils/myError";
import { DataIssueUser, ListGeneral, ProjectList } from "../../types/dataList";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../store/AuthContext";
import { ListSelect, Pagination } from "../../types";
import Navbar from "../../components/Navbar";
import { useSearchDebounce } from "../../hooks";
import {
  FaBusinessTime,
  FaCheck,
  FaClipboardCheck,
  FaDoorClosed,
  FaEllipsisV,
  FaExternalLinkAlt,
  FaFolderOpen,
  FaMagic,
  FaRegFileExcel,
  FaUserCheck,
} from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import { IconType } from "react-icons";
import { myDateFormat } from "../../utils/myFormat";
import { Card, CardBody, CardHeader } from "../../components/Card";
import { FiSearch } from "react-icons/fi";
import MyTable from "../../components/Table/MyTable";
import ModalDetailsIssue from "../../components/Issues/ModalDetailsIssue";
import ModalReopen from "../../components/Issues/ModalReopen";
import { initialDataIssueUser } from "../../utils/initialDataIssue";
import withAuth from "../../HOC/withAuth";
import ModalExportIssue from "../../components/Issues/ModalExportIssue";
import { Select as ReactSelect, GroupBase } from "chakra-react-select";

interface Props {
  dataIssues: Pagination<{ data: DataIssueUser[] }>;
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

const Issues: NextPage<Props> = ({
  dataIssues,
  ticketStatus,
  ticketCategory,
}) => {
  const textColor = useColorModeValue("gray.700", "white");
  const { userToken, userData, signOut } = useContext(AuthContext);

  const [dataTemp, setDataTemp] = useState<DataIssueUser>(initialDataIssueUser);
  const [configPage, setConfigPage] = useState({
    page: 1,
    perpage: 20,
    search: "",
    category_id: "",
    status_id: "",
  });
  const [projectCode, setProjectCode] = useState<ListSelect | null>(null);
  const [searchProject, setSearchProject] = useState("");

  const { dataSearch: dataSearchProject } = useSearchDebounce(
    searchProject,
    1000
  );
  const { dataSearch } = useSearchDebounce(configPage.search, 800);

  const toast = useToast();

  const {
    isOpen: isReOpen,
    onOpen: openReOpen,
    onClose: closeReOpen,
  } = useDisclosure();
  const {
    isOpen: isDetails,
    onOpen: openDetails,
    onClose: closeDetails,
  } = useDisclosure();
  const {
    isOpen: isExport,
    onOpen: openExport,
    onClose: closeExport,
  } = useDisclosure();

  const handleSetConfig = useCallback(
    (name: string, value: string | number) => {
      setConfigPage((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const { data: dataProject, isFetching: isFetchingProject } = useQuery<
    ProjectList[],
    AxiosError<ErrorResponseAPI>
  >(
    ["get-project", dataSearchProject],
    () => getProjectWithSearch(dataSearchProject, userToken),
    {
      onError: (error: AxiosError<ErrorResponseAPI>) =>
        myError(error, toast, signOut),
    }
  );

  const { data, isSuccess, isFetching, refetch } = useQuery<
    Pagination<{ data: DataIssueUser[] }>,
    AxiosError<ErrorResponseAPI>
  >(
    [
      "get-issues",
      configPage.page,
      configPage.perpage,
      dataSearch,
      configPage.category_id,
      configPage.status_id,
      projectCode?.value,
    ],
    () =>
      getIssueICT(
        configPage.page,
        configPage.perpage,
        dataSearch,
        configPage.category_id,
        configPage.status_id,
        userToken,
        projectCode?.value
      ),
    {
      enabled: userToken ? true : false,
      initialData: dataIssues,
      onSuccess: (dataSuccess) =>
        console.log("success issues: ", dataSuccess.data.length),
      onError: (err) => myError(err, toast, signOut),
    }
  );

  const newProjectList = useMemo<ListSelect[]>(() => {
    if (!dataProject) {
      return [];
    }

    const filtered = dataProject.map((item) => {
      return {
        value: String(item.project_no),
        label: `${item.code} - ${item.name}`,
      };
    });

    return [{ value: "", label: "All" }, ...filtered];
  }, [dataProject]);

  const columns = useMemo<ColumnDef<DataIssueUser, any>[]>(
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
      // {
      //   accessorKey: "project_code",
      //   header: () => "Project Code",
      //   cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
      //   footer: (props) => props.column.id,
      // },
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
                if (valStatus === "Closed") {
                  setDataTemp(info.row.original);
                  openReOpen();
                }
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
        cell: (info) => {
          return info.row.original.status_id === "Closed" ? (
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
                    openReOpen();
                  }}
                >
                  Reopen
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setDataTemp(info.row.original);
                    openDetails();
                  }}
                >
                  Details
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <IconButton
              aria-label="details"
              icon={<FaExternalLinkAlt />}
              variant="ghost"
              color="gray.400"
              onClick={() => {
                setDataTemp(info.row.original);
                openDetails();
              }}
            />
          );
        },
        footer: (props) => props.column.id,
      },
    ],
    [textColor, openReOpen, openDetails]
  );

  return (
    <Box>
      <ModalDetailsIssue
        visible={isDetails}
        onClose={closeDetails}
        data={dataTemp}
        onReopen={openReOpen}
      />
      <ModalReopen
        visible={isReOpen}
        onClose={closeReOpen}
        data={dataTemp}
        onFinish={() => {
          closeDetails();
          refetch();
        }}
      />
      <ModalExportIssue visible={isExport} onClose={closeExport} />
      <Navbar
        title="ISSUES"
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href="/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Issues</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      >
        <Card>
          <CardHeader mt="6px" mb="22px">
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              Issue Lists
            </Text>
          </CardHeader>
          <CardBody id="top_section">
            <Stack direction="row" justifyContent={"space-between"}>
              <Flex>
                <InputGroup size={"md"}>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="search.."
                    fontSize={"sm"}
                    borderRadius="15px"
                    defaultValue={configPage.search}
                    onChange={(val) =>
                      handleSetConfig("search", val.target.value)
                    }
                  />
                </InputGroup>
              </Flex>
              <Stack direction={{ base: "column", md: "row" }}>
               {/* <Box minWidth={240}>
                  <ReactSelect<ListSelect, false, GroupBase<ListSelect>>
                    onChange={(val) => setProjectCode(val)}
                    value={projectCode}
                    options={newProjectList}
                    placeholder="pilih kode project"
                    filterOption={(_, src) => {
                      setSearchProject(src);
                      return true;
                    }}
                    closeMenuOnSelect={true}
                    isLoading={isFetching}
                  />
                </Box>
*/}                <Select
                  placeholder="All Category"
                  size={"md"}
                  borderRadius="15px"
                  fontSize={"sm"}
                  value={configPage.category_id}
                  onChange={(val) =>
                    handleSetConfig("category_id", val.target.value)
                  }
                >
                  {ticketCategory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                <Select
                  placeholder="All Status"
                  size={"md"}
                  borderRadius="15px"
                  fontSize={"sm"}
                  value={configPage.status_id}
                  onChange={(val) =>
                    handleSetConfig("status_id", val.target.value)
                  }
                >
                  {ticketStatus.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                {userData.approval_level === 999 ? (
                  <Button
                    leftIcon={<FaRegFileExcel />}
                    colorScheme="teal"
                    variant="outline"
                    size="md"
                    borderRadius="15px"
                    fontSize="sm"
                    onClick={openExport}
                    minWidth={100}
                  >
                    Export
                  </Button>
                ) : null}
              </Stack>
            </Stack>
            <Box mt={10}>
              <MyTable
                pagination="server"
                data={isSuccess ? data.data : []}
                columns={columns}
                firstId="requestor"
                loading={isFetching}
                loadingSpan={columns.length}
                page={configPage.page}
                perPage={configPage.perpage}
                onFirstPage={() => handleSetConfig("page", 1)}
                onPrevPage={() =>
                  setConfigPage((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                onNextPage={() =>
                  setConfigPage((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                onLastPage={() =>
                  handleSetConfig("page", Number(data?.last_page))
                }
                onGoToPage={(e) => {
                  const pageset = e.target.value ? Number(e.target.value) : 0;
                  handleSetConfig("page", pageset);
                }}
                onPerPage={(e) =>
                  handleSetConfig("perpage", Number(e.target.value))
                }
                totalPage={data?.last_page || 0}
                totalData={data?.total || 0}
                disbleTableId
              />
            </Box>
          </CardBody>
        </Card>
      </Navbar>
    </Box>
  );
};

export default withAuth(Issues);

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
    const [ticketStatus, ticketCategory, dataIssues] = await Promise.all([
      getIssueIctStatus(ictAuth),
      getIssueIctCategory(ictAuth),
      getIssueICT(1, 20, "", "", "", ictAuth),
    ]);

    return {
      props: { dataIssues, ticketStatus, ticketCategory },
    };
  } catch (err) {
    return myErrorSSR<any>(err as AxiosError<ErrorResponseAPI>);
  }
};
