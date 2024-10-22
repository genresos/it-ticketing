import React from "react";
import {
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { FaMagic, FaDoorClosed } from "react-icons/fa";
import { MdOutlineLanguage } from "react-icons/md";
import { Card } from "../Card";
import { IconType } from "react-icons";
import { IssueSummary } from "../../types/dataList";
import { myNumberFormat } from "../../utils/myFormat";

interface Props {
  data: IssueSummary;
}

interface SummaryProps {
  label: string;
  value: string | number;
  icon: IconType;
}

const Summary = ({ label, value, icon }: SummaryProps) => {
  return (
    <Card minH="83px">
      <HStack>
        <Stat>
          <StatLabel color={"gray.400"}>{label}</StatLabel>
          <StatNumber fontSize="lg">{value}</StatNumber>
        </Stat>
        <Flex direction={"column"} bg="teal.300" p={3} borderRadius="xl">
          <Icon as={icon} color="white" boxSize={5} />
        </Flex>
      </HStack>
    </Card>
  );
};

const SummaryIssue = ({ data }: Props) => {
  return (
    <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
      <Summary
        label="All Issue"
        value={myNumberFormat(data.all_issue)}
        icon={MdOutlineLanguage}
      />
      <Summary
        label="New Issue"
        value={myNumberFormat(data.new_issue)}
        icon={FaMagic}
      />
      <Summary
        label="Closed Issue"
        value={myNumberFormat(data.closed_issue)}
        icon={FaDoorClosed}
      />
    </SimpleGrid>
  );
};

export default SummaryIssue;
