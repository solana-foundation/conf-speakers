"use client";

import SessionsTable, { SessionsTableProps } from "@/components/sessions-table";
import { useGlobalState } from "@/lib/state";

export default function ScheduleSessionsTable({ items, filters }: SessionsTableProps) {
  const { setSelectedSessions } = useGlobalState();

  return <SessionsTable items={items} filters={filters} selectable onSelect={setSelectedSessions} />;
}
