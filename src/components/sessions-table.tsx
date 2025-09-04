"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { formatVenueTime } from "@/lib/time/tz";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "./ui/table";
import { Session } from "@/lib/airtable/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useMemo } from "react";
import SessionSheet from "./session-sheet";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const columnHelper = createColumnHelper<Session & { subscribeUrl?: string }>();

export interface SessionsTableProps {
  items: (Session & { subscribeUrl?: string })[];
  filters?: {
    stages: Set<string>;
    times: Set<string>;
  };
}

export default function SessionsTable({ items, filters }: SessionsTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        id: "name",
        header: (info) => (
          <TableHead className="pb-4 pl-6">
            Name
            <Input
              placeholder="Filter by name..."
              value={(info.column.getFilterValue() as string) ?? ""}
              onChange={(event) => info.column.setFilterValue(event.target.value)}
              className="mt-1 w-full"
            />
          </TableHead>
        ),
        cell: (info) => (
          <TableCell className="pl-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative w-96 overflow-hidden font-bold text-nowrap text-ellipsis max-md:w-48">
                  {info.getValue()}
                </div>
              </TooltipTrigger>
              <TooltipContent>{info.getValue()}</TooltipContent>
            </Tooltip>
          </TableCell>
        ),
      }),
      columnHelper.accessor("startTime", {
        id: "startTime",
        header: (info) => (
          <TableHead className="w-48 pb-4">
            Time
            {filters && filters?.times.size > 0 && (
              <Select
                value={(info.column.getFilterValue() as string) ?? ""}
                onValueChange={(value) =>
                  value === "all" ? info.column.setFilterValue(undefined) : info.column.setFilterValue(value)
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Array.from(filters.times).map((time) => (
                    <SelectItem key={time} value={time}>
                      {formatVenueTime(time, "MMM d")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </TableHead>
        ),
        cell: (info) => {
          const startTime = info.getValue();
          const endTime = info.row.original.endTime;
          return (
            <TableCell>
              {startTime && (
                <span className="text-foreground/50 max-sm:text-sm sm:mr-2">{formatVenueTime(startTime, "MMM d")}</span>
              )}
              <br className="sm:hidden" />
              {startTime && endTime && (
                <span className="max-sm:text-sm">
                  {formatVenueTime(startTime, "HH:mm")} - {formatVenueTime(endTime, "HH:mm")}
                </span>
              )}
            </TableCell>
          );
        },
        filterFn: "includesString",
      }),
      columnHelper.accessor("stage", {
        id: "stage",
        header: (info) => (
          <TableHead className="w-32 pb-4">
            Stage
            {filters && filters?.stages.size > 0 && (
              <Select
                value={(info.column.getFilterValue() as string) ?? ""}
                onValueChange={(value) =>
                  value === "all" ? info.column.setFilterValue(undefined) : info.column.setFilterValue(value)
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Array.from(filters.stages).map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </TableHead>
        ),
        cell: (info) => (
          <TableCell>
            <Badge variant="default">{info.getValue()}</Badge>
          </TableCell>
        ),
      }),
    ],
    [filters],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Fragment key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </Fragment>
              ))}
              <TableHead className="w-32 text-right text-sm lg:pr-6"></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow className="relative" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Fragment key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Fragment>
              ))}
              <TableCell className="text-right lg:pr-6">
                <SessionSheet
                  name={row.original.name}
                  description={row.original.description}
                  startTime={row.original.startTime}
                  endTime={row.original.endTime}
                  stage={row.original.stage}
                  subscribeUrl={row.original.subscribeUrl}
                >
                  <Button className="max-lg:hidden" variant="outline" size="sm">
                    View Details
                  </Button>
                  <div className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer"></div>
                </SessionSheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
