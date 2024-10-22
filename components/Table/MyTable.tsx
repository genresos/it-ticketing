import { useState, useRef, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnDef,
  RowSelectionState,
  Row,
} from "@tanstack/react-table";
import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  Progress,
} from "@chakra-ui/react";
import PaginationBar from "./PaginationBar";
import NoDataFound from "./NoDataFound";
import PaginationBarSimple from "./PaginationBarSimple";

type Props =
  | {
      pagination: "client";
      selectionRow?: boolean;
      onGetSelectedRow?: (val: Row<any>[]) => void;
      resetSelectedRow?: number;
      data: unknown[];
      columns: ColumnDef<any, any>[];
      firstId: string;
      loading: boolean;
      loadingSpan: number;
      disablePagination?: boolean;
      simplePagination?: boolean;
      page?: undefined;
      perPage?: undefined;
      onFirstPage?: undefined;
      onPrevPage?: undefined;
      onNextPage?: undefined;
      onLastPage?: undefined;
      onGoToPage?: undefined;
      onPerPage?: undefined;
      totalPage?: undefined;
      totalData?: undefined;
      disbleTableId?: boolean;
    }
  | {
      pagination: "server";
      selectionRow?: boolean;
      onGetSelectedRow?: (val: Row<any>[]) => void;
      resetSelectedRow?: number;
      data: unknown[];
      columns: ColumnDef<any, any>[];
      firstId: string;
      loading: boolean;
      loadingSpan: number;
      disablePagination?: undefined;
      simplePagination?: undefined;
      page: number;
      perPage: number;
      onFirstPage: () => void;
      onPrevPage: () => void;
      onNextPage: () => void;
      onLastPage: () => void;
      onGoToPage: React.ChangeEventHandler<HTMLInputElement>;
      onPerPage: React.ChangeEventHandler<HTMLSelectElement>;
      totalPage: number;
      totalData: number;
      disbleTableId?: boolean;
    };

interface IndeterminateProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  indeterminate?: boolean;
}

const IndeterminateCheckbox = ({
  indeterminate,
  ...rest
}: IndeterminateProps) => {
  const ref = useRef({} as HTMLInputElement);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, rest.checked, indeterminate]);

  return <input type="checkbox" ref={ref} {...rest} />;
};

const MyTable = ({
  pagination,
  selectionRow,
  onGetSelectedRow,
  resetSelectedRow,
  data,
  columns,
  firstId,
  loading,
  loadingSpan,
  disablePagination,
  simplePagination,
  page,
  perPage,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
  onGoToPage,
  onPerPage,
  totalPage,
  totalData,
  disbleTableId,
}: Props) => {
  const [rowSelection, setRowSelection] = useState({} as RowSelectionState);
  const [sorting, setSorting] = useState<SortingState>([]);

  const newFirstId = useMemo(() => {
    if (selectionRow) {
      return "select";
    }

    return firstId;
  }, [firstId, selectionRow]);

  const table = useReactTable({
    data,
    columns: selectionRow
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <IndeterminateCheckbox
                {...{
                  checked: table.getIsAllRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
                }}
              />
            ),
            cell: ({ row }) => (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            ),
          },
          ...columns,
        ]
      : columns,
    state: {
      sorting,
      rowSelection: selectionRow ? rowSelection : undefined,
    },
    onRowSelectionChange: selectionRow ? setRowSelection : undefined,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      disablePagination && pagination !== "client"
        ? undefined
        : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    initialState:
      disablePagination && pagination !== "client"
        ? undefined
        : { pagination: { pageIndex: 0, pageSize: 20 } },
  });

  useEffect(() => {
    if (selectionRow) {
      const allSelected = table.getSelectedRowModel().flatRows;
      if (onGetSelectedRow) {
        onGetSelectedRow(allSelected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, selectionRow, table]);

  useEffect(() => {
    if (selectionRow && resetSelectedRow) {
      table.resetRowSelection();
    }
  }, [selectionRow, resetSelectedRow, table]);

  return (
    <Box id={disbleTableId ? undefined : "top_section"}>
      <Box
        overflowX="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            bg: "gray.200",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            bg: "gray.300",
            borderRadius: "4px",
          },
        }}
      >
        <Table variant="simple">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id} my=".8rem" pl="0px">
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      color="gray.400"
                      pl={header.id === newFirstId ? "0px" : "1.5rem"}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <Box
                          cursor={
                            header.column.getCanSort() ? "pointer" : "default"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " ▲",
                            desc: " ▼",
                          }[header.column.getIsSorted() as string] ?? null}
                        </Box>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
            <Tr>
              <td colSpan={selectionRow ? loadingSpan + 1 : loadingSpan || 2}>
                {loading ? (
                  <Progress size="xs" colorScheme="teal" isIndeterminate />
                ) : (
                  <Box h={1} />
                )}
              </td>
            </Tr>
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        pl={cell.column.id === newFirstId ? "0px" : "1.5rem"}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
          {data.length !== 0 && (
            <Tfoot>
              <Tr>
                {disablePagination ? null : (
                  <Td colSpan={7} pl="0px">
                    {selectionRow ? (
                      <Text fontSize="sm">
                        {Object.keys(rowSelection).length} of{" "}
                        {table.getPreFilteredRowModel().rows.length} Total Rows
                        Selected
                      </Text>
                    ) : (
                      <Text fontSize="sm">
                        Page rows: {table.getRowModel().rows.length}
                      </Text>
                    )}
                  </Td>
                )}
              </Tr>
            </Tfoot>
          )}
        </Table>
      </Box>
      {data.length === 0 ? (
        <NoDataFound />
      ) : (
        <>
          {pagination === "client" ? (
            <>
              {disablePagination ? null : (
                <>
                  {simplePagination ? (
                    <PaginationBarSimple
                      totalData={data?.length}
                      currentPage={table.getState().pagination.pageIndex + 1}
                      totalPage={table.getPageCount()}
                      page={table.getState().pagination.pageIndex + 1}
                      onFirstPage={() => table.setPageIndex(0)}
                      disableFirstPage={!table.getCanPreviousPage()}
                      onPrevPage={() => table.previousPage()}
                      disablePrevPage={!table.getCanPreviousPage()}
                      onNextPage={() => table.nextPage()}
                      disableNextPage={!table.getCanNextPage()}
                      onLastPage={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      disableLastPage={!table.getCanNextPage()}
                    />
                  ) : (
                    <PaginationBar
                      totalData={data?.length}
                      currentPage={table.getState().pagination.pageIndex + 1}
                      totalPage={table.getPageCount()}
                      page={table.getState().pagination.pageIndex + 1}
                      perPage={table.getState().pagination.pageSize}
                      onFirstPage={() => table.setPageIndex(0)}
                      disableFirstPage={!table.getCanPreviousPage()}
                      onPrevPage={() => table.previousPage()}
                      disablePrevPage={!table.getCanPreviousPage()}
                      onNextPage={() => table.nextPage()}
                      disableNextPage={!table.getCanNextPage()}
                      onLastPage={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      disableLastPage={!table.getCanNextPage()}
                      onGoToPage={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        table.setPageIndex(page);
                      }}
                      onPerPage={(e) => {
                        table.setPageSize(Number(e.target.value));
                      }}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {Object.keys(rowSelection).length === 0 && (
                <PaginationBar
                  totalData={totalData}
                  currentPage={page}
                  totalPage={totalPage}
                  page={page}
                  perPage={perPage}
                  onFirstPage={onFirstPage}
                  disableFirstPage={page <= 1}
                  onPrevPage={onPrevPage}
                  disablePrevPage={page <= 1}
                  onNextPage={onNextPage}
                  disableNextPage={page >= totalPage}
                  onLastPage={onLastPage}
                  disableLastPage={page >= totalPage}
                  onGoToPage={onGoToPage}
                  onPerPage={onPerPage}
                />
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default MyTable;
