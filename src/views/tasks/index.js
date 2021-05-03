import { useEffect, useRef, useState } from "react"
import { Button, CustomInput, Form, FormGroup, Input, Label, Row } from "reactstrap"
import DataTable from "react-data-table-component"
import { ChevronDown, Trash2 } from "react-feather"
import ReactPaginate from "react-paginate"
// import MapGL, {Marker, NavigationControl} from 'react-map-gl'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp'
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'
import 'mapbox-gl/dist/mapbox-gl.css'
import useJwt from '@src/auth/jwt/useJwt'
import MarkerLogo from '../../assets/images/pages/marker.png'
import Col from "reactstrap/lib/Col"
import Toasts from '../Toasts'
import { Slide, toast } from "react-toastify"
import jwtDefaultConfig from '@src/@core/auth/jwt/jwtDefaultConfig'

mapboxgl.workerClass = MapboxWorker
mapboxgl.accessToken = "pk.eyJ1IjoibWFsZXRpZ2VyIiwiYSI6ImNrbjQ5eGMxcTA0dDIydm9mbjY4Zm8wOHMifQ.TWABwlDJkdgUACO1DMeBPw"
const markerStyle = `width: 42px; height: 58px; background-size: contain; background-repeat: no-repeat; background-image: url(${MarkerLogo})`

const Tasks = () => {
  const mapContainer = useRef()
  const [showAllTasks, setShowAllTasks] = useState(false)
  const [data, setData] = useState([])
  const [taskName, setTaskName] = useState("")
  const [taskFile, setTaskFile] = useState(undefined)
  const [perPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [center, setCenter] = useState([
    151.21490299701586,
    -33.857362785537184
  ])
  const [marker, setMarker] = useState([
    151.21490299701586,
    -33.857362785537184
  ])

  const deleteTask = (_id) => {
    useJwt.deleteTask({_id}).then(({data})  => {
      if (data.status === true) {
        toast.success(Toasts.SuccessToast("The task is deleted successfully!"), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
        setData(data.data)
      } else {
        toast.error(Toasts.ErrorToast(data.data), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
      }
    }).catch((err) => { console.log(`err`, err) })
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
    e.preventDefault()
    const taskData = new FormData()
    taskData.append("position", JSON.stringify({lat: marker[1], lng: marker[0]}))
    taskData.append("taskName", taskName)
    taskData.append("taskFile", taskFile)
    
    useJwt.addTask(taskData).then(({data}) => {
      if (data.status === true) {
        toast.success(Toasts.SuccessToast("Task is added successfully!"), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
        setData(data.data)
      } else {
        toast.error(Toasts.ErrorToast(data.data), { transition: Slide, hideProgressBar: true, autoClose: 2000 })
      }
    }).catch((err) => { console.log(`err`, err) })
  }

  const onMarkerDragEnd = (e) => {
    setMarker([
      e.target._lngLat.lng,
      e.target._lngLat.lat
    ])
  }

  const renderAllTasks = (Map) => {
    
    data.forEach((item, i) => {
      const markerDiv = document.createElement('div')
      markerDiv.style.cssText = markerStyle
      
      new mapboxgl.Marker(markerDiv).setLngLat([item.task_position.lng, item.task_position.lat])
      .addTo(Map)
    })
  }

  const renderAMarker = (Map) => {
    const markerDiv = document.createElement('div')
    markerDiv.style.cssText = markerStyle

    const Marker = new mapboxgl.Marker(markerDiv, {
      draggable: true
    }).setLngLat(marker)
      .addTo(Map)

    Marker.on('dragend', onMarkerDragEnd)
  }
  
  useEffect(() => {
    useJwt.getTasks().then(({data}) => {
      if (data.status === true) {
        setData(data.data)
        if (data.data.length > 0) {
          setCenter([
            data.data[0].task_position.lng,
            data.data[0].task_position.lat
          ])
          setMarker([
            data.data[0].task_position.lng,
            data.data[0].task_position.lat
          ])
        }
      }
    }).catch((err) => { console.log(`err`, err) })
  }, [])
  
  useEffect(() => {
    const Map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 17.2,
      container: mapContainer.current
    })
  
    showAllTasks ? renderAllTasks(Map) : renderAMarker(Map)
  }, [showAllTasks])

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
        <div className="w-100 h-100" ref={mapContainer} />
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