"use client";
import React, { ReactNode } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface TableColumn<T> {
  accessor: keyof T;
  Header: ReactNode;
  Cell?: (props: { value: T[keyof T]; row: T }) => ReactNode;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  width?: string;
}

type RenderableValue = string | number | boolean | null | undefined;

interface TableProps<T extends Record<string, RenderableValue>> extends React.HTMLAttributes<HTMLTableElement> {
  data: T[];
  columns: TableColumn<T>[];
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  className?: string;
  footer?: ReactNode;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

function Table<T extends Record<string, RenderableValue>>({
  data = [],
  columns = [],
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  sortable = false,
  pagination = false,
  itemsPerPage = 10,
  className = '',
  ...props
}: TableProps<T>) {
  const theme = useTheme();
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // Request sort handler
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sorted data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const column = columns.find(col => col.accessor === sortConfig.key);
      
      if (column && column.sortFn) {
        return sortConfig.direction === 'asc' 
          ? column.sortFn(a, b)
          : column.sortFn(b, a);
      }
      
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      
      // Compare non-null values
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, columns]);
  
  // Get paginated data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, pagination, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const changePage = (page: number) => setCurrentPage(page);
  
  // Style classes using theme colors
  const tableClasses = [
    'w-full',
    bordered ? 'border border-slate-200' : '',
    className
  ].join(' ');
  
  const thClasses = [
    'px-4',
    compact ? 'py-2' : 'py-3',
    'text-left text-xs font-semibold uppercase tracking-wider',
    bordered ? 'border border-slate-200' : 'border-b border-slate-200',
    'bg-slate-50'
  ].join(' ');
  
  const tdClasses = [
    'px-4',
    compact ? 'py-2' : 'py-3',
    'text-sm text-slate-700',
    bordered ? 'border border-slate-200' : ''
  ].join(' ');
  
  const trClasses = [
    hoverable ? 'hover:bg-primary-light/5' : '',
    'transition-colors'
  ].join(' ');
  
  const paginationButtonClasses = [
    'relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md',
    'transition-colors duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ].join(' ');
  
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className={tableClasses} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`${thClasses} ${sortable && column.sortable !== false ? 'cursor-pointer select-none' : ''}`}
                onClick={() => {
                  if (sortable && column.sortable !== false) {
                    requestSort(column.accessor as string);
                  }
                }}
                style={{ width: column.width }}
              >
                <div className="flex items-center justify-between">
                  {column.Header}
                  {sortable && column.sortable !== false && (
                    <span className="flex flex-col ml-1">
                      <ChevronUp 
                        className={`w-3 h-3 ${
                          sortConfig.key === column.accessor && sortConfig.direction === 'asc'
                            ? 'text-primary'
                            : 'text-slate-400'
                        }`} 
                      />
                      <ChevronDown 
                        className={`w-3 h-3 -mt-1 ${
                          sortConfig.key === column.accessor && sortConfig.direction === 'desc'
                            ? 'text-primary'
                            : 'text-slate-400'
                        }`} 
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {paginatedData.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`${trClasses} ${striped && rowIndex % 2 === 1 ? 'bg-slate-50' : ''}`}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={tdClasses}>
                  {column.Cell ? column.Cell({ value: row[column.accessor], row }) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {props.footer && (
          <tfoot className="bg-slate-50 border-t border-slate-200">
            {props.footer}
          </tfoot>
        )}
      </table>
      
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => changePage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`${paginationButtonClasses} bg-white text-slate-700 border-slate-300 hover:bg-slate-50`}
            >
              Previous
            </button>
            <button
              onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`${paginationButtonClasses} ml-3 bg-white text-slate-700 border-slate-300 hover:bg-slate-50`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, sortedData.length)}
                </span>{' '}
                of <span className="font-medium">{sortedData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`${paginationButtonClasses} rounded-l-md bg-white text-slate-500 border-slate-300 hover:bg-slate-50`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    aria-current={currentPage === page ? 'page' : undefined}
                    className={`
                      ${paginationButtonClasses}
                      ${currentPage === page
                        ? theme.getGradient('primary') + ' text-white border-primary'
                        : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`${paginationButtonClasses} rounded-r-md bg-white text-slate-500 border-slate-300 hover:bg-slate-50`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;