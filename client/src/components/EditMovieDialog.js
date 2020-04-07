import React, { useState } from 'react'

import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

const EditMovieDialog = props => {
  const { movie, editMovieHandler } = props
  const [tempMovie, setMovie] = useState({...movie})
  const [open, setOpen] = React.useState(false)


  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleEdit = event => {
    editMovieHandler(tempMovie)
    setOpen(false)
  }

  const handleChange = name => ({ target: { value } }) => {
    setMovie({ ...tempMovie, [name]: value })
  }

  return (
    <div>
      <Tooltip title="Add a new movie">
        <Button aria-label="add" onClick={handleClickOpen} startIcon={<EditIcon />} >
          Edit
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Movie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={tempMovie.title}
            onChange={handleChange('title')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Release Year"
            type="number"
            fullWidth
            value={tempMovie.releaseYear}
            onChange={handleChange('releaseYear')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Origin/Ethnicity"
            type="text"
            fullWidth
            value={tempMovie.originEthnicity}
            onChange={handleChange('originEthnicity')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="director"
            type="text"
            fullWidth
            value={tempMovie.director}
            onChange={handleChange('director')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="cast"
            type="text"
            fullWidth
            value={tempMovie.cast}
            onChange={handleChange('cast')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Genre"
            type="text"
            fullWidth
            value={tempMovie.genre}
            onChange={handleChange('genre')}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Wiki Page"
            type="text"
            fullWidth
            value={tempMovie.wikiPage}
            onChange={handleChange('wikiPage')}
          />
          <span className="edit-plot-label">Plot</span>
          <TextareaAutosize 
            aria-label="empty textarea"
            placeholder="The plot of the movie"
            value={tempMovie.plot}
            onChange={handleChange('plot')}
            className="edit-plot-textarea"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEdit} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

EditMovieDialog.propTypes = {
  movie: PropTypes.object.isRequired,
}

export default EditMovieDialog
