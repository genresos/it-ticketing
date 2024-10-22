import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ActiveElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { DataChart } from "../../types/dataChart";
import { mySum } from "../../utils/myFunction";
import { myNumberFormat } from "../../utils/myFormat";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  dataChart: DataChart[];
  label: string;
  colorList?: string[];
  customInfoCenter?: React.ReactNode;
  labelColorCenter?: string;
  valueColorCenter?: string;
}

const DoughnutChart = ({
  dataChart,
  label,
  colorList,
  customInfoCenter,
  labelColorCenter,
  valueColorCenter,
}: Props) => {
  const [dataCenter, setDataCenter] = useState({
    label: "",
    value: 0,
  });

  const textColor = useColorModeValue("#4A5568", "#CBD5E0");
  const strokeColor = useColorModeValue("white", "#2D3748");
  const labelColor = useColorModeValue(
    labelColorCenter || "gray.400",
    labelColorCenter || "gray.500"
  );

  const chartRef =
    useRef<ChartJSOrUndefined<"doughnut", number[], unknown>>(null);

  const data = useMemo<ChartData<"doughnut">>(() => {
    const labelList = dataChart.map((item) => item.label);
    const valueList = dataChart.map((item) => item.value);

    return {
      labels: labelList,
      datasets: [
        {
          label: label,
          data: valueList,
          backgroundColor: colorList || [
            "#085d85",
            "#efde5b",
            "#398967",
            "#c84b8e",
            "#f9b2b3",
            "#9b6140",
            "#a43c39",
            "#292d50",
            "#627b8c",
          ],
          borderColor: [strokeColor],
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }, [dataChart, label, colorList, strokeColor]);

  const handleSetInfo = useCallback(
    (elements: ActiveElement[]) => {
      if (elements.length === 0) {
        return;
      }

      const idx = elements[0].index;
      const dataSet = dataChart[idx];

      setDataCenter({
        label: dataSet.label,
        value: dataSet.value,
      });
    },
    [dataChart]
  );

  const options = useMemo<ChartOptions<"doughnut">>(() => {
    return {
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            color: textColor,
          },
        },
      },
      onClick: (_, elements) => handleSetInfo(elements),
    };
  }, [handleSetInfo, textColor]);

  useEffect(() => {
    const total = mySum(dataChart.map((item) => item.value));
    setDataCenter({
      label: "Total",
      value: total,
    });
  }, [dataChart]);

  const charWidth = chartRef.current?.width || 0;

  return (
    <Box position="relative">
      <Doughnut ref={chartRef} data={data} options={options} />
      <Flex
        position="absolute"
        top={{ base: charWidth / 7.7, md: charWidth / 6 }}
        right={{ base: charWidth / 2.65, md: charWidth / 2.9 }}
        direction="column"
        alignItems="center"
        justifyContent="center"
        w={{ base: charWidth / 4.1, md: charWidth / 3.2 }}
        h={{ base: charWidth / 4.1, md: charWidth / 3.2 }}
        borderRadius="full"
      >
        {customInfoCenter ? (
          customInfoCenter
        ) : (
          <Box textAlign="center" mt={{ base: -1, md: -2 }}>
            <Text
              title={dataCenter.label}
              color={labelColor}
              fontSize={{ base: "xs", md: "lg" }}
              noOfLines={1}
            >
              {dataCenter.label}
            </Text>
            <Text
              title={myNumberFormat(dataCenter.value)}
              fontSize={{ base: "xl", md: "4xl" }}
              fontWeight={500}
              noOfLines={1}
              color={valueColorCenter}
            >
              {myNumberFormat(dataCenter.value)}
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default DoughnutChart;
