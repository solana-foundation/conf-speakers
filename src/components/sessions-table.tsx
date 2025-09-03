"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { formatVenueTime } from "@/lib/time/tz";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "./ui/table";
import { Session } from "@/lib/airtable/types";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Fragment } from "react";
import SessionSheet from "./session-sheet";

const columnHelper = createColumnHelper<Session & { subscribeUrl?: string }>();

const columns = [
  columnHelper.accessor("name", {
    id: "name",
    header: () => <TableHead className="pl-6">Name</TableHead>,
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
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("startTime", {
    id: "startTime",
    header: () => <TableHead>Time</TableHead>,
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
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("stage", {
    id: "stage",
    header: () => <TableHead>Stage</TableHead>,
    cell: (info) => (
      <TableCell>
        <Badge variant="default">{info.getValue()}</Badge>
      </TableCell>
    ),
    footer: (info) => info.column.id,
  }),
];

export interface SessionsTableProps {
  items: (Session & { subscribeUrl?: string })[];
}

export default function SessionsTable({ items }: SessionsTableProps) {
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
              <TableHead className="text-right text-sm lg:pr-6"></TableHead>
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
