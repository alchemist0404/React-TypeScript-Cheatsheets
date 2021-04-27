import { useEffect, useRef, useState } from "react"
import { Button, CustomInput, Form, FormGroup, Input, Label, Row } from "reactstrap"
import DataTable from "react-data-table-component"
import { ChevronDown, Trash2 } from "react-feather"
import ReactPaginate from "react-paginate"
import MapGL, {Marker, NavigationControl} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import useJwt from '@src/auth/jwt/useJwt'
import MarkerLogo from '../../assets/images/pages/marker.png'
import Col from "reactstrap/lib/Col"
import Toasts from '../Toasts'
import { Slide, toast } from "react-toastify"
import jwtDefaultConfig from '@src/@core/auth/jwt/jwtDefaultConfig'

const accessToken = "pk.eyJ1IjoibWFsZXRpZ2VyIiwiYSI6ImNrbjQ5eGMxcTA0dDIydm9mbjY4Zm8wOHMifQ.TWABwlDJkdgUACO1DMeBPw"

const Tasks = () => {
  const [showAllTasks, setShowAllTasks] = useState(false)
  const [data, setData] = useState([])
  const [taskName, setTaskName] = useState("")
  const [taskFile, setTaskFile] = useState(undefined)
  const [perPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [viewport, setViewport] = useState({
    longitude: 151.21490299701586,
    latitude: -33.857362785537184,
    zoom: 16,
    bearing: 0,
    pitch: 0
  })
  const [marker, setMarker] = useState({
    longitude: 151.21490299701586,
    latitude: -33.857362785537184
  })

  const deleteTask = (_id) => {
    useJwt.deleteTask({_id}).then(({data})  => {
      if (data.status === true) {
        toast.success(Toasts.SuccessToast("The task is deleted successfully!"), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
        setData(data.data)
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
      name: 'Longitude',
      selector: 'lng',
      sortable: true,
      minWidth: '100px',
      cell: row => (
        <div>{`${row.task_position.lng}`}</div>
      )
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

  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const handleShowAllTasks = () => {
    setShowAllTasks(!showAllTasks)
  }

  const addTask = (e) => {
    e.preventDefault();
    const taskData = new FormData()
    taskData.append("position", JSON.stringify({lat: marker.latitude, lng: marker.longitude}))
    taskData.append("taskName", taskName)
    taskData.append("taskFile", taskFile)
    
    useJwt.addTask(taskData).then(({data}) => {
      if (data.status === true) {
        toast.success(Toasts.SuccessToast("Task is added successfully!"), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
        setData(data.data)
      } else {
        toast.error(Toasts.ErrorToast(data.data), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
      }
    }).catch((err) => { console.log(`err`, err) });
  }
  
  useEffect(() => {
    useJwt.getTasks().then(({data}) => {
      if (data.status === true) {
        setData(data.data)
        if (data.data.length > 0) {
          setViewport({
            ...viewport,
            latitude: data.data[0].task_position.lat,
            longitude: data.data[0].task_position.lng
          })
          setMarker({
            latitude: data.data[0].task_position.lat,
            longitude: data.data[0].task_position.lng
          })
        }
      }
    }).catch((err) => { console.log(`err`, err) });
  }, [])

  const onMarkerDragEnd = (e) => {
    setMarker({
      longitude: e.lngLat[0],
      latitude: e.lngLat[1]
    })
  }

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

  return (
    <div className='misc-wrapper'>
      <div className="w-100 mb-1 position-relative" style={{height: "400px", overflow: "hidden", borderRadius: 10}}>
        <Button color="primary" className="position-absolute" style={{zIndex: 999, right: 10, top: 10}} onClick={() => handleShowAllTasks()}>{showAllTasks ? `Hide` : `Show all tasks`}</Button>
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onViewportChange={setViewport}
          mapboxApiAccessToken={accessToken}
        >
          {
            showAllTasks ? data.map((item, i) => (
              <Marker
                key={i}
                longitude={item.task_position.lng}
                latitude={item.task_position.lat}
              >
                <div style={{backgroundImage: `url(${MarkerLogo})`, width: 44, height: 58, backgroundRepeat:"no-repeat", backgroundSize: "contain"}}></div>
              </Marker>
            )) : <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                draggable
                onDragEnd={onMarkerDragEnd}
              >
                <div style={{backgroundImage: `url(${MarkerLogo})`, width: 44, height: 58, backgroundRepeat:"no-repeat", backgroundSize: "contain"}}></div>
              </Marker>
          }
        </MapGL>
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