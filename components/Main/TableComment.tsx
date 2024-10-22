import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { TicketComment } from "../../types/dataList";
import MyTable from "../Table/MyTable";

interface Props {
  ticket_comments: TicketComment[];
}

const TableComment = ({ ticket_comments }: Props) => {
  const textColor = useColorModeValue("gray.700", "white");

  const columns = useMemo<ColumnDef<TicketComment, any>[]>(
    () => [
      {
        accessorKey: "creator",
        header: () => "ICT",
        cell: (info) => {
          const value = info.getValue();
          return value === 0 ? (
            <Text fontSize="md" color={textColor} fontWeight="bold">
              Belum ada komen
            </Text>
          ) : (
            <Box>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {info.getValue()}
              </Text>
              <Text fontSize="sm" color={textColor} fontWeight="bold" mt="6px">
                {info.row.original.status}
              </Text>
              <Text fontSize="sm" color={textColor} pb=".5rem">
                {info.row.original.created_time}
              </Text>
            </Box>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "comment",
        header: () => "Comment",
        cell: (info) => {
          const value = info.getValue();
          return value === 0 ? null : (
            <Text fontSize="sm" color={textColor}>
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
    <MyTable
      pagination="client"
      data={ticket_comments}
      columns={columns}
      firstId="creator"
      loading={false}
      loadingSpan={columns.length}
      disablePagination
    />
  );
};

export default TableComment;
