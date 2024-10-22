import {
  Box,
  HStack,
  Select,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../store/AuthContext";
import { DataIssueCloseDay, ListGeneral } from "../../types/dataList";
import { ErrorResponseAPI } from "../../types/error";
import { getIssueCloseDay } from "../../utils/fetchApi";
import { myError } from "../../utils/myError";
import { myNumberFormat } from "../../utils/myFormat";
import { Card } from "../Card";

interface Props {
  data: DataIssueCloseDay;
  issueCategory: ListGeneral[];
}

const IssueCloseInDay = ({ data, issueCategory }: Props) => {
  const textColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.400", "gray.500");

  const [category, setCategory] = useState("");

  const { userToken, signOut } = useContext(AuthContext);
  const toast = useToast();

  const { data: dataIssueClose, isFetching } = useQuery<
    DataIssueCloseDay,
    AxiosError<ErrorResponseAPI>
  >(
    ["get-issue-close", category],
    () => getIssueCloseDay(category, userToken),
    {
      enabled: userToken ? true : false,
      initialData: data,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onError: (err) => myError(err, toast, signOut),
    }
  );

  return (
    <Card mt="26px">
      <HStack>
        <Box flex={1} mr={4}>
          <Text fontSize="lg" color={textColor} fontWeight="bold">
            Issue Closed in a Day {isFetching && <Spinner size="sm" />}
          </Text>
          <Select
            borderRadius="15px"
            fontSize="sm"
            placeholder="Select issue category"
            size="md"
            id="year"
            mr="10px"
            maxW={{ base: "inherit", md: "220px" }}
            mt="10px"
            defaultValue={""}
            onChange={(val) => setCategory(val.target.value)}
          >
            {issueCategory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </Box>
        <HStack spacing={4} pr={{ base: 0, md: 8 }}>
          <Stat
            borderWidth={1}
            borderColor={labelColor}
            borderRadius={8}
            px={4}
            py={2}
          >
            <StatLabel>Total</StatLabel>
            <StatNumber>
              {myNumberFormat(dataIssueClose.total_closed_in_a_day)}
            </StatNumber>
          </Stat>
          <Stat
            borderWidth={1}
            borderColor={labelColor}
            borderRadius={8}
            px={4}
            py={2}
          >
            <StatLabel>Average</StatLabel>
            <StatNumber>
              {myNumberFormat(dataIssueClose.average_close_in_a_day)}
            </StatNumber>
          </Stat>
        </HStack>
      </HStack>
    </Card>
  );
};

export default IssueCloseInDay;
