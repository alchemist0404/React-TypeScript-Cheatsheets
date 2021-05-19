import React, { useEffect, useState } from 'react'
import DataTable from "react-data-table-component"
import { ChevronDown, Trash2 } from "react-feather"
import ReactPaginate from "react-paginate"
import useJwt from '@src/auth/jwt/useJwt'

const Users = () => {
    const [state, setState] = useState({
        perPage: 10,
        currentPage: 0,
        data: []
    })

    const [columns] = useState([
        {
          name: 'Email',
          selector: 'username',
          sortable: true,
          minWidth: '100px'
        },
        {
          name: 'Full Name',
          selector: 'fullName',
          sortable: true,
          minWidth: '100px'
        },
        {
          name: 'Balance',
          selector: 'balance',
          sortable: true,
          minWidth: '30px'
        },
        {
          name: 'Point',
          selector: 'points',
          sortable: true,
          minWidth: '30px'
        },
        {
          name: 'Collected Logo',
          selector: 'collectedLogos',
          sortable: true,
          minWidth: '30px'
        },
        {
          name: 'Created At',
          selector: 'createdAt',
          sortable: true,
          minWidth: '100px',
          cell: (row) => (
              row.createdAt.split("T")[0]
          )
        }
    ])

    useEffect(() => {
        useJwt.getAllUsers().then((result) => {
            setState({...state, data: result.data.data})
        }).catch((err) => {
            console.log(`err`, err)
        });
    }, [])

    const CustomPagination = () => (
        <ReactPaginate
          previousLabel={''}
          nextLabel={''}
          forcePage={state.currentPage}
          onPageChange={page => handlePagination(page)}
          pageCount={Math.ceil(state.data.length / state.perPage)}
          breakLabel={'...'}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName={'active'}
          pageClassName={'page-item'}
          nextLinkClassName={'page-link'}
          nextClassName={'page-item next'}
          previousClassName={'page-item prev'}
          previousLinkClassName={'page-link'}
          pageLinkClassName={'page-link'}
          breakClassName='page-item'
          breakLinkClassName='page-link'
          containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1'}
        />
    )
    return (
        <div className='misc-wrapper'>
            <DataTable
                noHeader
                pagination
                data={state.data}
                columns={columns}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                paginationDefaultPage={state.currentPage + 1}
                paginationPerPage={state.perPage}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationComponent={CustomPagination}
            />
        </div>
    )
}

export default Users