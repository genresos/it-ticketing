import {
  HStack,
  Icon,
  Select,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import React, { useContext, useMemo, useState } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { AuthContext } from "../../store/AuthContext";
import { IssueTableList } from "../../types/dataList";
import { ErrorResponseAPI } from "../../types/error";
import { getIssueTable } from "../../utils/fetchApi";
import listMonth from "../../utils/listMonth";
import { myError } from "../../utils/myError";
import { myNumberFormat } from "../../utils/myFormat";
import { mySum } from "../../utils/myFunction";
import { CardTitle } from "../Card";
import { MyProgress } from "../Main";
import MyTable from "../Table/MyTable";

interface Props {
  data: IssueTableList[];
}

export interface IssueTableListReduce {
  user: string;
  total_issue: number;
  DailyChecking: number;
  eProject: number;
  GeneralRequest: number;
  HardwareInstallation: number;
  MonthlyPreventiveMaintenance: number;
  Networking: number;
  Question: number;
  SoftwareInstallation: number;
  Suggestion: number;
}

const tahun = new Date().getFullYear();

const TableICTSummary = ({ data }: Props) => {
  const textColor = useColorModeValue("gray.700", "white");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const { userToken, signOut } = useContext(AuthContext);
  const toast = useToast();

  const { data: dataTable, isFetching } = useQuery<
    IssueTableList[],
    AxiosError<ErrorResponseAPI>
  >(
    ["get-issue-table", month, year],
    () => getIssueTable(userToken, year, month),
    {
      enabled: userToken && year ? true : false,
      initialData: data,
      onError: (err) => myError(err, toast, signOut),
    }
  );

  const newData = useMemo(() => {
    const dataFilter = [...dataTable].filter((val) => val.user !== null);

    const totalMap = dataFilter.map((item) => item.total_issue);
    const totalIssue = mySum(totalMap);

    const ictTable = dataFilter.map(
      ({ user, total_issue, issue_by_category }) => {
        const categoryKey = issue_by_category.map((item, idx) => {
          return {
            idx,
            keyName: Object.keys(item)[0],
          };
        });

        const newCategory = categoryKey.map((val) => {
          return {
            label: val.keyName,
            // @ts-ignore
            value: issue_by_category[val.idx][val.keyName],
          };
        });

        const restObj = newCategory.reduce((acc, value) => {
          return { ...acc, [value.label]: value.value };
        }, {});

        return {
          user,
          total_issue,
          ...restObj,
        } as IssueTableListReduce;
      }
    );
    return { totalIssue, ictTable };
  }, [dataTable]);

  const columns = useMemo<ColumnDef<IssueTableListReduce, any>[]>(
    () => [
      {
        accessorKey: "user",
        header: () => "ICT",
        cell: (info) => {
          return (
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "DailyChecking",
        header: () => "Daily",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "eProject",
        header: () => "Eproj",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "GeneralRequest",
        header: () => "Gener",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "HardwareInstallation",
        header: () => "Hardw",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "MonthlyPreventiveMaintenance",
        header: () => "Month",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "Networking",
        header: () => "Netwo",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "Question",
        header: () => "Quest",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "SoftwareInstallation",
        header: () => "Softw",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "Suggestion",
        header: () => "Sugge",
        cell: (info) => {
          return (
            <Text fontSize="sm" color={textColor}>
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "total_issue",
        header: () => "Total",
        cell: (info) => {
          return (
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {info.getValue()}
            </Text>
          );
        },
        footer: (props) => props.column.id,
      },
    ],
    [textColor]
  );

  return (
    <>
      <MyProgress loadings={[isFetching]} />
      <CardTitle
        title="ICT Summary"
        value={`${myNumberFormat(newData.totalIssue)} issues`}
        label="have been registered."
        extra={
          <HStack>
            <Select
              borderRadius="15px"
              fontSize="sm"
              placeholder="Year"
              size="md"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              maxW={{ base: "inherit", md: "120px" }}
              my={{ base: "20px", md: "inherit" }}
            >
              <option value={tahun - 2}>{tahun - 2}</option>
              <option value={tahun - 1}>{tahun - 1}</option>
              <option value={tahun}>{tahun}</option>
              <option value={tahun + 1}>{tahun + 1}</option>
            </Select>
            <Select
              borderRadius="15px"
              fontSize="sm"
              placeholder="Month"
              size="md"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              maxW={{ base: "inherit", md: "100px" }}
              disabled={!year}
            >
              {listMonth.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </HStack>
        }
      />
      <MyTable
        pagination="client"
        data={newData.ictTable}
        columns={columns}
        firstId="user"
        loading={false}
        loadingSpan={columns.length}
        disablePagination
      />
    </>
  );
};

export default TableICTSummary;
