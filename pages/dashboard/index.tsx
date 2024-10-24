import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import withAuth from "../../HOC/withAuth";
import { GetServerSideProps } from "next";
import { myErrorSSR } from "../../utils/myError";
import { AxiosError } from "axios";
import { ErrorResponseAPI } from "../../types/error";
import {
  CurrentIssues,
  DataIssueCloseDay,
  IssueLineChart,
  IssuePieCart,
  IssueSummary,
  IssueTableList,
  ListGeneral,
} from "../../types/dataList";
import { getDataDashboard } from "../../utils/fetchApi";
import Navbar from "../../components/Navbar";
import {
  IssueCloseInDay,
  LineChartIssue,
  PieChartIssue,
  SummaryIssue,
  TableCurrentIssue,
  TableICTSummary,
  UserDashboard,
} from "../../components/Dashboard";
import { Card, GridItemCard } from "../../components/Card";

interface Props {
  issueSummary: IssueSummary;
  issuePieChart: IssuePieCart;
  issueLineChart: IssueLineChart;
  issueCurrent: CurrentIssues;
  issueTable: IssueTableList[];
  issueCloseDay: DataIssueCloseDay;
  issueCategory: ListGeneral[];
}

const Dashboard = ({
  issueSummary,
  issuePieChart,
  issueLineChart,
  issueCurrent,
  issueTable,
  issueCloseDay,
  issueCategory,
}: Props) => {
  const textColor = useColorModeValue("gray.700", "white");
  const { userData } = useContext(AuthContext);
  return (
    <Navbar
      title="DASHBOARD"
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      {[999, 777].indexOf(userData.approval_level) !== -1 ? (
        <Box pt="20px">
          <Flex mb="20px" flexDir="row" alignItems="flex-end">
            <Text color={textColor} fontSize="lg" mr="8px">
              Welcome back
            </Text>
            <Text color={textColor} fontSize="xl" fontWeight="bold">
              {userData.name}!
            </Text>
          </Flex>
          <SummaryIssue data={issueSummary} />
          <IssueCloseInDay
            data={issueCloseDay}
            issueCategory={issueCategory}
          />
          <Grid
            minH={"200px"}
            templateRows={{ base: "repeat(2, auto)", lg: "repeat(1, auto)" }}
            templateColumns="repeat(5, 1fr)"
            gap="24px"
            my="26px"
          >
            <GridItemCard colSpan={{ base: 5, lg: 2 }}>
              <PieChartIssue data={issuePieChart} />
            </GridItemCard>
            <GridItemCard colSpan={{ base: 5, lg: 3 }}>
              <LineChartIssue data={issueLineChart} />
            </GridItemCard>
          </Grid>
          <Box mb="26px">
            <Card p="16px">
              <TableICTSummary data={issueTable} />
            </Card>
          </Box>
          <Box>
            <Card p="16px">
              <TableCurrentIssue data={issueCurrent} />
            </Card>
          </Box>
          <Box mt={20} mb={10}>
            <Text color={textColor}>Copyright&copy; PT. Tesco Indomaritim 2024.</Text>
          </Box>
        </Box>
      ) : (
        <UserDashboard />
      )}
    </Navbar>
  );
};

export default withAuth(Dashboard);

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
    const dataDashboard = await getDataDashboard(ictAuth);

    return {
      props: dataDashboard,
    };
  } catch (err) {
    return myErrorSSR<any>(err as AxiosError<ErrorResponseAPI>);
  }
};
