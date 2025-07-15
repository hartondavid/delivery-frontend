import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { formatDate } from '../utils/utilFunctions';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';

interface Column {
    field: string;
    headerName: string;
    type?: string;
    renderCell?: (params: { row: any; value: any }) => React.ReactNode;
}

interface Action {
    icon: React.ReactNode | ((row: any) => React.ReactNode);
    onClick: (id: string | number, row: any) => void;
    condition?: (row: any) => boolean;
    color?: string;
}

interface GenericTableProps {
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonAction?: () => void;
    columns: Column[];
    data: any[];
    childrenColumns?: Column[];
    childrenData?: Record<string | number, any[]>;
    isExtendedTable?: boolean;
    edit?: boolean;
    onEdit?: (id: string | number) => void;
    actions?: Action[];
}

const GenericTable: React.FC<GenericTableProps> = ({
    title,
    subtitle,
    buttonText,
    buttonAction,
    columns,
    data,
    childrenColumns = [],
    childrenData,
    isExtendedTable = false,
    edit,
    onEdit,
    actions = []
}) => {

    // Pagination state
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Default to 5 rows per page
    const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

    // Handle page change
    const handleChangePage = (event: unknown, newPage: number): void => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    // Calculate the rows to display on the current page
    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const toggleRow = (rowId: string | number): void => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId], // Toggle the expanded state for the specific row
        }));
    };

    const hasChildren = (row: any): boolean => {
        return !!(childrenData && childrenData[row.id] && childrenData[row.id].length > 0);
    };

    return (
        <>
            <Box className="flex flex-row justify-between" sx={{ m: 2 }}>
                <Typography variant="h4">
                    {title}
                </Typography>
                <Typography variant="h6">
                    {subtitle}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {buttonText && buttonAction && (
                        <Button variant="contained" onClick={buttonAction} sx={{
                            mt: -4,
                            backgroundColor: ' #009688', color: 'white'
                        }}>
                            {buttonText}
                        </Button>
                    )}
                </Box>
            </Box>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>{isExtendedTable === true && (
                            <TableCell></TableCell>
                        )}{columns.map((column) => (
                            <TableCell key={`generic-table-column-${column.field}`}>{column.headerName}</TableCell>
                        ))}{edit && <TableCell>Actions</TableCell>} {/* Add Actions column if edit is true */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <React.Fragment key={`generic_table_row_paginated_parent_${row.id}_${index}`}>
                                <TableRow key={`generic_table_row_paginated_${row.id}_${index}`}>{isExtendedTable === true && (
                                    <TableCell>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => toggleRow(row.id)}
                                        >
                                            {expandedRows[row.id] ? (
                                                <KeyboardArrowUpIcon />
                                            ) : (
                                                <KeyboardArrowDownIcon />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                )}{columns.map((column) => {
                                    if (row[column.field] === null) {
                                        return <TableCell key={`generic-table-second-${column.field}`}></TableCell>;
                                    }
                                    if (column.renderCell) {
                                        return (
                                            <TableCell key={`generic-table-rendercell-${column.field}`}>
                                                {column.renderCell({ row, value: row[column.field] })}
                                            </TableCell>
                                        );
                                    }

                                    if (column.type === 'date') {
                                        return <TableCell key={`generic-table-date-${column.field}`}>{formatDate(new Date(row[column.field]))}</TableCell>;
                                    } else {
                                        return <TableCell key={`generic-table-default-${column.field}`}>{row[column.field]}</TableCell>;
                                    }
                                })}{(edit || (actions && actions.length > 0)) && (
                                    <TableCell style={{ width: '0', whiteSpace: 'nowrap' }}>
                                        <Box display="flex" alignItems="center">
                                            {edit && (
                                                <IconButton
                                                    onClick={() => onEdit && onEdit(row.id)}
                                                    style={{ color: 'black' }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {actions && actions.map((action, i) => (
                                                (!action.condition || (typeof action.condition === 'function' && action.condition(row))) && (
                                                    <IconButton
                                                        key={`generic-table-dynamic-actions-${i}`}
                                                        onClick={() => action.onClick(row.id, row)}
                                                        style={{ color: action.color || 'black' }}
                                                    >
                                                        {typeof action.icon === 'function' ? action.icon(row) : action.icon}
                                                    </IconButton>
                                                )
                                            ))}
                                        </Box>
                                    </TableCell>
                                )}
                                </TableRow>
                                {hasChildren(row) && (
                                    <TableRow key={`generic-table-children-row-${row.id}`}>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length}>
                                            <Collapse in={expandedRows[row.id]} timeout="auto">
                                                <Box>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                {childrenColumns.map(col => (
                                                                    <TableCell key={col.field}>{col.headerName}</TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {childrenData && childrenData[row.id] && childrenData[row.id].map((childRow) => (
                                                                <TableRow key={`generic-table-child-row-${childRow.id}`}>{childrenColumns && childrenColumns.map((column) => (
                                                                    <TableCell key={`generic-table-child-column-${childRow.id}-${column.field}`}>
                                                                        {column.renderCell
                                                                            ? column.renderCell({ value: childRow[column.field], row: childRow })
                                                                            : childRow[column.field]}
                                                                    </TableCell>
                                                                ))}</TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Rânduri pe pagină:"
                />
            </TableContainer>
        </>
    );
};

export default GenericTable; 