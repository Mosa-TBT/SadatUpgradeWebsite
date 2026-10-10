"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TableSkeleton, EmptyState } from "@/components/admin/ui";

export interface DataTableColumn<T extends object> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

export interface DataTablePagination {
  page: number;
  lastPage: number;
  total?: number | null;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T extends object> {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  empty?: ReactNode;
  pagination?: DataTablePagination;
  onRowClick?: (row: T) => void;
  rowKey?: string;
}

export function DataTable<T extends object>({
  columns,
  rows,
  loading,
  empty,
  pagination,
  onRowClick,
  rowKey = "id",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 font-semibold", col.className)}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6">
                  <TableSkeleton cols={Math.min(columns.length, 5)} />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6">
                  {empty || <EmptyState />}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={(row as Record<string, unknown>)[rowKey] as React.Key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "transition",
                    onRowClick && "cursor-pointer hover:bg-gray-50",
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 align-middle text-gray-700", col.className)}>
                      {col.render
                        ? col.render(row)
                        : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.lastPage > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
          <p>
            Page {pagination.page} of {pagination.lastPage}
            {pagination.total != null && (
              <span className="text-gray-400"> · {pagination.total} total</span>
            )}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.lastPage}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}