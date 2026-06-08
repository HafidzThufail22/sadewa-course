import { ReactNode, useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  emptyMessage = "Belum ada data yang tersedia.",
  isLoading = false,
  loadingRows = 5,
  className = "",
}: TableProps<T>) {
  const hasHeader = title || description || actions;
  const skeletonRows = Array.from({ length: loadingRows });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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
              {columns.map((column, columnIndex) => {
                const align = column.align ?? (columnIndex === 0 ? "left" : "center");

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
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
                  className="transition-colors hover:bg-blue-50/50"
                >
                  {columns.map((column, columnIndex) => {
                    const align = column.align ?? (columnIndex === 0 ? "left" : "center");

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

      {!isLoading && data.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-blue-100 bg-blue-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Tampilkan</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="rounded border border-gray-200 bg-white px-2 py-1 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-blue-100"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>data</span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 text-sm">
            <span className="text-gray-500">
              {data.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} -{" "}
              {Math.min(currentPage * rowsPerPage, data.length)} dari {data.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Sebelumnya"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Selanjutnya"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
