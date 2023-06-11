import { useState } from "react";
import STUDENT from "../student2.json";
import {
  useReactTable,
  getExpandedRowModel,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getGroupedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Table from 'react-bootstrap/Table';

const columnHelper = createColumnHelper()


const BasicTable = () => {
  const [data, setData] = useState([...STUDENT]);
  const [grouping, setGrouping] = useState([])
    const [pagination,setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
  const [expanded, setExpanded] = useState({})

  const [columns, setColumns] = useState([
      {
        header: 'Full Name',
        columns: [
          {
            accessorKey: 'firstName',
            header: (props)=>{
                console.log(props)
                return(
                    <>
                    <button onClick={props.table.getToggleAllRowsExpandedHandler()}>
                        { props.table.getIsAllRowsExpanded() ? "🔼" : "🔽" }
                    </button>
                    First Name
                    </>
                )
            },
            cell: (props) => {
                return (
                    <div style={{
                        paddingLeft:`${props.row.depth*2}rem`
                    }}>
                       { props.row.getCanExpand() ?
                      <>
                       <button onClick={props.row.getToggleExpandedHandler()}>
                            { props.row.getIsExpanded() ? "🔼" : "🔽"}
                        </button>
                      </> 
                        :
                        <button>⏹</button>
                        }
                        {props.getValue()}
                    </div>
                )
            },
          },
          {
            accessorKey: 'lastName',
            header: 'Last Name',
            cell: info => info.getValue(),
          },
        ],
      },
    {
      accessorKey: "email",
      header: "Email",
    },
    columnHelper.group({
        header: 'Phone Number',
        columns: [
            columnHelper.accessor(row => row.phone["1"],{
                id: "1",
                cell: info => info.getValue(),
                header: "first number"
            }),
            columnHelper.accessor(row => row.phone["2"],{
                id: "2",
                cell: info => info.getValue(),
                header: "first number"
            }),
        ]
    }),
    {
        accessorKey: "date_of_birth",
        header: "Date of birth",
        cell: (props) => new Date(props.getValue()).toDateString() 
    },
    columnHelper.display({
        id: 'pincode',
        cell: ({ row }) =>{
            return  ` ${row.original.address.pincode} ${row.original.address.city} ${row.original.address.state} `
        },
        header: "Pincode"
    })

  ]);

  const tableInstance = useReactTable({
    columns,
    data,
    state: {
        grouping,
        pagination:pagination,
        expanded
    },
    getSubRows: row => row.subRows,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onGroupingChange: setGrouping,  
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  console.log(tableInstance.getRowModel());

  return (
    <div>
      <Table striped bordered hover variant="dark" responsive size="sm">
        <thead>
          {tableInstance.getHeaderGroups().map((headerGroup) => {
            return (
              <>
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <>
                        <th colSpan={header.colSpan} key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      </>
                    );
                  })}
                </tr>
              </>
            );
          })}
        </thead>
        <tbody>
            {
                tableInstance.getRowModel().rows.map((row)=>{
                    return(
                        <>
                        {
                            <tr key={row.id}>    
                                {
                                    row.getVisibleCells().map((cell)=>{
                                        return <>
                                         <td key={cell.id}>
                                           {flexRender(
                                             cell.column.columnDef.cell,
                                             cell.getContext()
                                           )}
                                         </td>
                                        </>
                                    })
                                }

                            </tr>
                        }
                        </>
                    )
                })
            }
        </tbody>
        <tfoot>
        {tableInstance.getFooterGroups().map((footerGroup) => {
            return (
              <>
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => {
                    return (
                      <>
                        <th colSpan={header.colSpan} key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      </>
                    );
                  })}
                </tr>
              </>
            );
          })}
        </tfoot>
      </Table>
       <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => tableInstance.setPageIndex(0)}
          disabled={!tableInstance.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => tableInstance.previousPage()}
          disabled={!tableInstance.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => {
            console.log( tableInstance.nextPage())
            tableInstance.nextPage()
          }}
          disabled={!tableInstance.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => tableInstance.setPageIndex(tableInstance.getPageCount() - 1)}
          disabled={!tableInstance.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {tableInstance.getState().pagination.pageIndex + 1} of{' '}
            {tableInstance.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={tableInstance.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              tableInstance.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={tableInstance.getState().pagination.pageSize}
          onChange={e => {
            tableInstance.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BasicTable;
