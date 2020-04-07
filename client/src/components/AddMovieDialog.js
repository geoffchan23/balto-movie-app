import React, { useState } from 'react'

import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

const initialMovie = {
  title: '',
  releaseYear: 2020,
  originEthnicity: '',
  director: '',
  cast: '',
  genre: '',
  wikiPage: '',
  plot: '',
}

const AddMovieDialog = props => {
  const [movie, setMovie] = useState(initialMovie)
  const { addMovieHandler } = props
  const [open, setOpen] = React.useState(false)

  const [switchState, setSwitchState] = React.useState({
    addMultiple: false,
  })

  const handleSwitchChange = name => event => {
    setSwitchState({ ...switchState, [name]: event.target.checked })
  }

  const resetSwitch = () => {
    setSwitchState({ addMultiple: false })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    resetSwitch()
  }

  const handleAdd = event => {
    addMovieHandler(movie)
    setMovie(initialMovie)
    switchState.addMultiple ? setOpen(true) : setOpen(false)
  }

  const handleChange = name => ({ target: { value } }) => {
    setMovie({ ...movie, [name]: value })
  }

  return (
    <div>
      <Tooltip title="Add a new movie">
        <Button aria-label="add" onClick={handleClickOpen} startIcon={<AddIcon />} >
          Add Movie
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Movie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={movie.title}
            onChange={handleChange('title')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Release Year"
            type="number"
            fullWidth
            value={movie.releaseYear}
            onChange={handleChange('releaseYear')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Origin/Ethnicity"
            type="text"
            fullWidth
            value={movie.originEthnicity}
            onChange={handleChange('originEthnicity')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="director"
            type="text"
            fullWidth
            value={movie.director}
            onChange={handleChange('director')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="cast"
            type="text"
            fullWidth
            value={movie.cast}
            onChange={handleChange('cast')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Genre"
            type="text"
            fullWidth
            value={movie.genre}
            onChange={handleChange('genre')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Wiki Page"
            type="text"
            fullWidth
            value={movie.wikiPage}
            onChange={handleChange('wikiPage')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Plot"
            type="text"
            fullWidth
            value={movie.plot}
            onChange={handleChange('plot')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

AddMovieDialog.propTypes = {
  addMovieHandler: PropTypes.func.isRequired,
}

export default AddMovieDialog
