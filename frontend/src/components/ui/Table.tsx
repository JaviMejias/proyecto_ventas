import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  emptyState?: ReactNode;
  rowClassName?: (item: T) => string;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyState,
  rowClassName,
}: TableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700/50">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''} ${rowClassName?.(item) || ''}`}
            >
              {columns.map((col, i) => (
                <td key={i} className={`py-4 px-4 align-middle ${col.className || ''}`}>
                  {col.cell ? col.cell(item) : col.accessor ? String(item[col.accessor]) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
