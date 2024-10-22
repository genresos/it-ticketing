import { Select, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "../../store/AuthContext";
import { DataChart } from "../../types/dataChart";
import { IssueLineChart, LineChartData } from "../../types/dataList";
import { ErrorResponseAPI } from "../../types/error";
import { getIssueLineChart } from "../../utils/fetchApi";
import { myError } from "../../utils/myError";
import { myNumberFormat } from "../../utils/myFormat";
import { CardTitle } from "../Card";
import { AreaChart } from "../Chart";
import { MyProgress } from "../Main";

interface Props {
  data: IssueLineChart;
}

const tahun = new Date().getFullYear();

const LineChartIssue = ({ data }: Props) => {
  const [year, setYear] = useState("");

  const { userToken, signOut } = useContext(AuthContext);
  const toast = useToast();

  const { data: dataChart, isFetching } = useQuery<
    IssueLineChart,
    AxiosError<ErrorResponseAPI>
  >(["get-issue-line-chart", year], () => getIssueLineChart(userToken, year), {
    enabled: userToken && year ? true : false,
    initialData: data,
    onError: (err) => myError(err, toast, signOut),
  });

  const newData = useMemo(() => {
    const { line_chart } = dataChart;
    const newLineChart = line_chart[0];
    const keyData = Object.keys(newLineChart).filter(
      (key) => key !== "total_issue"
    ) as any[];

    const dataIssue: DataChart[] = keyData.map((item: keyof LineChartData) => {
      const idx = newLineChart[item];
      return {
        label: item,
        value: idx.total_issue,
      };
    });

    const totalIssue = line_chart[0].total_issue.issue;

    return { data: dataIssue, total: totalIssue };
  }, [dataChart]);

  return (
    <>
      <MyProgress loadings={[isFetching]} />
      <CardTitle
        title="Issues Overview"
        value={`${myNumberFormat(newData.total)} issues`}
        label="have occurred."
        extra={
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
        }
      />
      <AreaChart dataChart={newData.data} label="Issue" />
    </>
  );
};

export default LineChartIssue;
