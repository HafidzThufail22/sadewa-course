import { ReactNode } from "react";

type Align = "left" | "center" | "right";

export interface TableColumn<T> {
  key: keyof T | string;
  header: ReactNode;
  accessor?: keyof T | ((row: T, index: number) => ReactNode);
  cell?: (row: T, index: number) => ReactNode;
  align?: Align;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey?: (row: T, index: number) => string | number;
  title?: string;
  description?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingRows?: number;
  className?: string;
}

const alignments: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function getCellValue<T>(
  row: T,
  column: TableColumn<T>,
  index: number,
): ReactNode {
  if (column.cell) {
    return column.cell(row, index);
  }

  if (typeof column.accessor === "function") {
    return column.accessor(row, index);
  }

  const key = column.accessor ?? column.key;

  if (typeof key === "string" && row && typeof row === "object" && key in row) {
    return (row as Record<string, ReactNode>)[key];
  }

  return null;
}

export default function Table<T>({
  columns,
  data,
  getRowKey,
  title,
  description,
  actions,
  footer,
  emptyMessage = "Belum ada data yang tersedia.",
  isLoading = false,
  loadingRows = 5,
  className = "",
}: TableProps<T>) {
  const hasHeader = title || description || actions;
  const skeletonRows = Array.from({ length: loadingRows });

  return (
    <div
      className={`overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm ${className}`}
    >
      {hasHeader && (
        <div className="flex flex-col gap-4 border-b border-blue-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-bold text-gray-950">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50/80">
            <tr>
              {columns.map((column) => {
                const align = column.align ?? "left";

                return (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className={`whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-primary ${alignments[align]} ${column.headerClassName ?? ""}`}
                  >
                    {column.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading &&
              skeletonRows.map((_, rowIndex) => (
                <tr key={`loading-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-5 py-4">
                      <div className="h-4 w-full max-w-40 animate-pulse rounded-full bg-blue-100" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading &&
              data.map((row, rowIndex) => (
                <tr
                  key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
                  className="transition-colors hover:bg-blue-50/50"
                >
                  {columns.map((column) => {
                    const align = column.align ?? "left";

                    return (
                      <td
                        key={String(column.key)}
                        className={`whitespace-nowrap px-5 py-4 text-sm text-gray-700 ${alignments[align]} ${column.className ?? ""}`}
                      >
                        {getCellValue(row, column, rowIndex)}
                      </td>
                    );
                  })}
                </tr>
              ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {footer && (
        <div className="border-t border-blue-100 bg-blue-50/40 px-5 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}
