import { useEffect, useRef, useState } from "react"
import { Button, CustomInput, Form, FormGroup, Input, Label, Row } from "reactstrap"
import DataTable from "react-data-table-component"
import { ChevronDown, Trash2 } from "react-feather"
import ReactPaginate from "react-paginate"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import useJwt from '@src/auth/jwt/useJwt'
import L from 'leaflet'
import MarkerLogo from '../../assets/images/pages/marker.png'
import Col from "reactstrap/lib/Col"
import Toasts from '../Toasts'
import { Slide, toast } from "react-toastify"
import jwtDefaultConfig from '@src/@core/auth/jwt/jwtDefaultConfig'


const Tasks = () => {
  const [showAllTasks, setShowAllTasks] = useState(false)
  const [data, setData] = useState([])
  const [allMarkers, setAllMarkers] = useState([])
  const [taskName, setTaskName] = useState("")
  const [taskFile, setTaskFile] = useState(undefined)
  const [perPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [center, setCenter] = useState({
    lat: -33.85737747155127,
    lng: 151.21532678604126
  })
  const [marker, setMarker] = useState({
    lat: -33.85737747155127,
    lng: 151.21532678604126
  })

  const refreshAllMakers = (data) => {
    const allTasks = []
    for (let i = 0; i < data.length; i++) {
      const markerPosition = []
      markerPosition.push(data[i].task_position.lat)
      markerPosition.push(data[i].task_position.lng)
      allTasks.push({markerPosition})
    }
    setAllMarkers(allTasks)
  }

  const deleteTask = (_id) => {
    useJwt.deleteTask({_id}).then(({data})  => {
      if (data.status === true) {
        toast.success(Toasts.SuccessToast("The task is deleted successfully!"), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
        setData(data.data)
        refreshAllMakers(data.data)
      } else {
        toast.error(Toasts.ErrorToast(data.data), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
      }
    }).catch((err) => { console.log(`err`, err) });
  }

  const [columns] = useState([
    {
      name: 'Task Name',
      selector: 'task_name',
      sortable: true,
      minWidth: '50px'
    },
    {
      name: 'Latitude',
      selector: 'lat',
      sortable: true,
      minWidth: '100px',
      cell: row => (
        <div>{`${row.task_position.lat}`}</div>
      )
    },
    {
      name: 'Longitude',
      selector: 'lng',
      sortable: true,
      minWidth: '100px',
      cell: row => (
        <div>{`${row.task_position.lng}`}</div>
      )
    },
    {
      name: 'File',
      selector: 'task_file',
      sortable: true,
      minWidth: '100px',
      cell: row => (
        <div>
          {`${jwtDefaultConfig.fileUrl}${row.task_file}`}
        </div>
      )
    },
    {
      name: 'Action',
      selector: 'action',
      sortable: true,
      maxWidth: '80px',
      minWidth: '80px',
      cell: row => (
        <Trash2 size={20} onClick={() => deleteTask(row._id)} />
      )
    }
  ])

  const refmarker = useRef()

  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const handleShowAllTasks = () => {
    setShowAllTasks(!showAllTasks)
    refreshAllMakers(data)
  }

  const updateMarkerPosition = () => {
    const marker = refmarker.current
    if (marker !== null) {
      setMarker(marker.leafletElement.getLatLng())
    }
  }

  const addTask = (e) => {
    e.preventDefault();
    const marker = refmarker.current
    const taskData = new FormData()
    taskData.append("position", JSON.stringify({lat: marker._latlng.lat, lng: marker._latlng.lng}))
    taskData.append("taskName", taskName)
    taskData.append("taskFile", taskFile)
    
    useJwt.addTask(taskData).then(({data}) => {
      if (data.status === true) {
        toast.success(Toasts.SuccessToast("Task is added successfully!"), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
        setData(data.data)
        refreshAllMakers(data.data)
      } else {
        toast.error(Toasts.ErrorToast(data.data), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
      }
    }).catch((err) => { console.log(`err`, err) });
  }
  
  useEffect(() => {
    useJwt.getTasks().then(({data}) => {
      if (data.status === true) {
        setData(data.data)
        // if (data.data.length > 0) {
        //   setCenter(data.data[0].task_position)
        // }
      }
    }).catch((err) => { console.log(`err`, err) });
  }, [])
  
  const MarkerIcon = L.icon({
    iconUrl: MarkerLogo,

    iconSize:     [43, 60] // size of the icon
  });

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={Math.ceil(data.length / perPage)}
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

  const position = [center.lat, center.lng]
  const markerPosition = [marker.lat, marker.lng]

  return (
    <div className='misc-wrapper'>
      <div className="w-100 mb-1 position-relative" style={{height: "400px"}}>
        <Button color="primary" className="position-absolute" style={{zIndex: 999, right: 10, top: 10}} onClick={() => handleShowAllTasks()}>{showAllTasks ? `Hide` : `Show all tasks`}</Button>
        <MapContainer center={position} zoom={18} className='leaflet-map h-100'>
          <TileLayer
            attribution='&ampcopy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {
            showAllTasks ? allMarkers.map((item, i) => (
              <Marker key={i} icon={MarkerIcon} position={item.markerPosition}>
              </Marker>
            )) : <Marker icon={MarkerIcon} draggable={true} dragend={updateMarkerPosition} position={markerPosition} ref={refmarker}>
            </Marker>
          }
        </MapContainer>
      </div>
      {
        showAllTasks ? "" : <Form onSubmit={addTask}>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for='taskname'>Task Name</Label>
                  <Input
                    type='text'
                    id='taskname'
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for='tasklogo'>Task File</Label>
                  <CustomInput
                    type='file'
                    id='tasklogo'
                    name='taskfile'
                    onChange={(e) => setTaskFile(e.target.files[0])}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="d-flex align-items-end">
                <Button color="primary" type="submit" className="mb-1 float-right">Add a Task</Button>
              </Col>
            </Row>
          </Form>
      }
      <DataTable
        noHeader
        pagination
        data={data}
        columns={columns}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        paginationPerPage={perPage}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationComponent={CustomPagination}
      />
    </div>
  )
}
export default Tasks