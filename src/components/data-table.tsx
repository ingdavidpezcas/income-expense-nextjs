"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";

import { useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./date-range-picker";

import { LayoutIcon } from "@radix-ui/react-icons";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSizeOptions?: number[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});
  //console.log("Columns:", columns);
  //console.log("Data:", data);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      dateRangeFilter: (row, columnId, filterValue: DateRange) => {
        const cellValue = row.getValue(columnId) as string;
        const date = new Date(cellValue);
        if (!filterValue.from || !filterValue.to) return true;
        return date >= filterValue.from && date <= filterValue.to;
      },
    },
  });

  React.useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      table.getColumn("created_at")?.setFilterValue(dateRange);
    } else {
      table.getColumn("created_at")?.setFilterValue(undefined);
    }
  }, [dateRange, table]);

  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? 1;
  const perPage = searchParams.get("per_page") ?? 10;

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000); // Simula una carga de 2s
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full py-2">
      <div className="flex items-center pb-3 gap-2">
        {/* <Input
          placeholder="Filter by description..."
          value={
            (table.getColumn("description")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
        {/* <DateRangePicker
          onUpdate={(values) => console.log(values)}
          initialDateFrom="2024-01-01"
          initialDateTo="2024-12-31"
          align="start"
          locale="en-GB"
          showCompare={false}
        /> */}
        <DateRangeFilter onRangeChange={setDateRange} />
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs ml-auto hidden h-8 lg:flex"
              >
                <LayoutIcon /> Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table className="w-full caption-bottom text-sm">
            <TableHeader className="[&_tr]:border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="h-10 px-2 text-left align-middle font-normal text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-0">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    key={i}
                  >
                    {columns.map((_, j) => (
                      <TableCell
                        key={j}
                        className="px-2 py-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                      >
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "description") {
                        return (
                          <TableCell
                            key={cell.id}
                            className="px-2 py-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                          >
                            <div className="flex items-center space-x-2">
                              {
                                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                                  Income
                                </div> // Mostrar un texto si no hay categoría
                              }
                              <span className="max-w-[31.25rem] text-xs truncate font-medium">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </span>
                            </div>
                          </TableCell>
                        );
                      }
                      // Para las otras celdas, solo renderiza el valor
                      return (
                        <TableCell
                          key={cell.id}
                          className="px-2 py-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-muted-foreground"
                  >
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 mt-2">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
          <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Rows per page
              </p>
              <Select
                value={`${perPage}`}
                onValueChange={(value) => {
                  table.setPageIndex(0);
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[4.5rem]"></SelectTrigger>
                <SelectContent
                  side="top"
                  className="dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40"
                >
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center text-sm font-medium">
              Page {page} of {table.getPageCount()}
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center space-x-2">
                <Button
                  aria-label="Go to first page"
                  variant="outline"
                  className="hidden size-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <DoubleArrowLeftIcon className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  aria-label="Go to previous page"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  aria-label="Go to next page"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  aria-label="Go to last page"
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <DoubleArrowRightIcon className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
