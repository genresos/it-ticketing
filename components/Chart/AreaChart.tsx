import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { DataChart } from "../../types/dataChart";
import { useColorModeValue } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface Props {
  dataChart: DataChart[];
  label: string;
  rgbColor?: number[];
}

const AreaChart = ({ dataChart, label, rgbColor }: Props) => {
  const colorGrid = useColorModeValue("#EDF2F7", "#4A5568");

  const options = useMemo<ChartOptions<"line">>(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: "top" as const,
        },
        title: {
          display: false,
          text: "Chart.js Line Chart",
        },
        tooltip: {
          usePointStyle: true,
          padding: 12,
          titleMarginBottom: 10,
          bodySpacing: 8,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          ticks: { color: "#c4c4c4" },
          grid: {
            display: true,
            color: colorGrid,
          },
        },
        x: {
          ticks: { color: "#c4c4c4" },
          grid: {
            display: false,
          },
        },
      },
    };
  }, [colorGrid]);

  const data = useMemo<ChartData<"line">>(() => {
    const labelList = dataChart.map((item) => item.label.substring(0, 3));
    const valueList = dataChart.map((item) => item.value);

    const newRGB = rgbColor ? rgbColor.join() : "79, 209, 197";
    return {
      labels: labelList,
      datasets: [
        {
          fill: true,
          label: label,
          data: valueList,
          tension: 0.3,
          pointStyle: "circle",
          pointBorderWidth: 0,
          pointBackgroundColor: `rgba(${newRGB}, 0)`,
          pointHoverBackgroundColor: `rgba(${newRGB}, 1)`,
          borderWidth: 4,
          borderColor: `rgba(${newRGB}, 1)`,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 500);
            gradient.addColorStop(0, `rgba(${newRGB}, 0.35)`);
            gradient.addColorStop(1, `rgba(${newRGB}, 0.05)`);
            return gradient;
          },
        },
      ],
    };
  }, [dataChart, label, rgbColor]);
  return <Line options={options} data={data} height={180} />;
};

export default AreaChart;
