import React, { useState } from 'react'
import { TableContainer } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import EditMovieDialog from './EditMovieDialog'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function DataTable({ data, editMovieHandler, deleteMovieHandler }) {
  const [plotOpen, setOpenPlot] = useState(false)
  const [currentPlot, setCurrentPlot] = useState('')

  return (<>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Release Year</TableCell>
            <TableCell>Origin/Ethnicity</TableCell>
            <TableCell>Director</TableCell>
            <TableCell>Cast</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Wiki Page</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { data.map((row, index) => (
            <TableRow key={index} className='row'>
              <TableCell align="left" className='title-column'>{row.title}</TableCell>
              <TableCell align="left" className='year-column'>{row.releaseYear}</TableCell>
              <TableCell align="left" className='origin-column'>{row.originEthnicity}</TableCell>
              <TableCell align="left" className='director-column'>{row.director}</TableCell>
              <TableCell align="left" className='cast-column'>{row.cast}</TableCell>
              <TableCell align="left" className='genre-column'>{row.genre}</TableCell>
              <TableCell align="left" className='wiki-column'>{ row.wikiPage ? <a href={row.wikiPage}>Wiki</a> : 'N/A' }</TableCell>
              <TableCell align="left" className='actions-column'>
                <EditMovieDialog
                  movie={row}
                  editMovieHandler={editMovieHandler}
                />
                <Tooltip title="Delete this movie">
                  <Button aria-label="delete" onClick={() => deleteMovieHandler(row)} color="secondary" startIcon={<DeleteIcon />} >
                    Delete
                  </Button>
                </Tooltip>
                { row.plot && row.plot !== '' && <Button aria-label="view plot" onClick={() => { setOpenPlot(true); setCurrentPlot(row.plot) }}>Plot</Button> }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Dialog
      open={plotOpen}
      onClose={() => setOpenPlot(false)}
      aria-labelledby="form-dialog-plot"
    >
        <DialogTitle id="form-dialog-title">Plot</DialogTitle>
        <DialogContent style={{ paddingBottom: '20px', fontSize: '12px' }}>{currentPlot}</DialogContent>
      </Dialog>
  </>)
}