import React, { useState, useMemo, useContext } from "react";
import { Flex, Box, Select, useToast } from "@chakra-ui/react";
import { IssuePieCart, PieChartData } from "../../types/dataList";
import listMonth from "../../utils/listMonth";
import { AuthContext } from "../../store/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorResponseAPI } from "../../types/error";
import { getIssuePieChart } from "../../utils/fetchApi";
import { myError } from "../../utils/myError";
import { MyProgress } from "../Main";
import { DataChart } from "../../types/dataChart";
import { mySum } from "../../utils/myFunction";
import { CardTitle } from "../Card";
import { myNumberFormat } from "../../utils/myFormat";
import { DoughnutChart } from "../Chart";

interface Props {
  data: IssuePieCart;
}

const tahun = new Date().getFullYear();

const PieChartIssue = ({ data }: Props) => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const { userToken, signOut } = useContext(AuthContext);
  const toast = useToast();

  const { data: dataChart, isFetching } = useQuery<
    IssuePieCart,
    AxiosError<ErrorResponseAPI>
  >(
    ["get-issue-pie-chart", month, year],
    () => getIssuePieChart(userToken, year, month),
    {
      enabled: userToken && year ? true : false,
      initialData: data,
      onError: (err) => myError(err, toast, signOut),
    }
  );

  const newData = useMemo(() => {
    const { pie_chart } = dataChart;
    const newPieChart = pie_chart[0];
    const keyData = Object.keys(newPieChart).filter(
      (key) => key !== "AllCategory"
    ) as any[];
    const dataIssue: DataChart[] = keyData.map((item: keyof PieChartData) => {
      const idx = newPieChart[item];
      return {
        label: item,
        value: idx.total_issue,
      };
    });

    const totalIssue = mySum(dataIssue.map((val) => val.value));

    return { data: dataIssue, total: totalIssue };
  }, [dataChart]);

  return (
    <>
      <MyProgress loadings={[isFetching]} />
      <Box mb="20px">
        <CardTitle
          title="Issue By Category"
          value={myNumberFormat(newData.total)}
          label="total issues"
          extra={
            <Flex
              flexDir={{ base: "column", md: "row" }}
              justifyContent="flex-end"
            >
              <Select
                borderRadius="15px"
                fontSize="sm"
                placeholder="Year"
                size="md"
                id="year"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                }}
                mr="10px"
                maxW={{ base: "inherit", md: "120px" }}
                mb={{ base: "20px", md: "inherit" }}
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
                onChange={(e) => {
                  setMonth(e.target.value);
                }}
                mr="10px"
                maxW={{ base: "inherit", md: "100px" }}
                disabled={!year}
              >
                {listMonth.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </Flex>
          }
        />
      </Box>
      <DoughnutChart dataChart={newData.data} label="Issue" />
    </>
  );
};

export default PieChartIssue;
