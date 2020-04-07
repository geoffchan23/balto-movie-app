import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import MovieIcon from '@material-ui/icons/Movie'
import Backdrop from '@material-ui/core/Backdrop';
import DataTable from './components/DataTable'
import AddMovieDialog from './components/AddMovieDialog'
import Button from '@material-ui/core/Button'
import './App.scss'

const apiUrl = 'http://localhost:5000'
const yearsList = (() => {
  let max = new Date().getFullYear()
  let min = max - 119
  let years = []

  for (let i = max; i >= min; i--) {
    years.push(i)
  }
  return years
})()

function App() {
  const [movieList, setMovieList] = useState([])
  const [searchQuery, updateSearchQuery] = useState('geoff')
  const [yearQuery, updateYearQuery] = useState('')
  const [loaderOpen, setLoaderOpen] = useState(false)

  useEffect(() => {
    (async function() {
      try {
        setLoaderOpen(true)
        const data = await (await fetch(`${apiUrl}/movies?title=geoff`)).json()
        setMovieList(data.movies)
        setLoaderOpen(false)
      } catch(e) {
        setLoaderOpen(false)
      }
    })()
  }, [])

  async function addMovieHandler(newMovie) {
    setLoaderOpen(true)
    let query = '';
    for (let key in newMovie) {
      if (newMovie.hasOwnProperty(key)) {
        query = query + `${key}=${newMovie[key]}&`
      }
    }
    try {
      const results = await (await fetch(`${apiUrl}/createMovie?${query}`)).json()
      const newList = [...movieList]
      newList.unshift(results.movie)
      setMovieList(newList)
    } catch(e) {
      console.log('error adding', e)
    }
    setLoaderOpen(false)
  }

  async function searchForMovie(e) {
    if (e) e.preventDefault()
    setLoaderOpen(true)
    const results = await (await fetch(`${apiUrl}/movies?title=${searchQuery}${yearQuery !== '' ? `&releaseYear=${yearQuery}` : ''}`)).json()
    setMovieList(results.movies)
    setLoaderOpen(false)
  }

  async function editMovieHandler(movie) {
    console.log('edit movie', movie)
    setLoaderOpen(true)
      let query = '';
      for (let key in movie) {
        if (movie.hasOwnProperty(key)) {
          query = query + `${key}=${movie[key]}&`
        }
      }
      try {
        const results = await (await fetch(`${apiUrl}/updateMovie/${movie.id}/?${query}`)).json()
        searchForMovie();
      } catch(e) {
        console.log('error adding', e)
        setLoaderOpen(false)
      }
  }

  async function deleteMovieHandler(movie) {
    if (window.confirm(`Delete ${movie.title}?`)) {
      setLoaderOpen(true)
      let query = '';
      for (let key in movie) {
        if (movie.hasOwnProperty(key)) {
          query = query + `${key}=${movie[key]}&`
        }
      }
      try {
        const results = await (await fetch(`${apiUrl}/deleteMovie/${movie.id}/?${query}`)).json()
        searchForMovie();
      } catch(e) {
        console.log('error adding', e)
        setLoaderOpen(false)
      }
    }
  }

  const handleLoaderClose = () => {
    setLoaderOpen(false)
  }

  return (
    <div className="App">
      <header>
        <MovieIcon style={{ color: 'white', marginRight: '10px' }} />
        <form onSubmit={searchForMovie}>
          <input value={searchQuery} onChange={(e) => updateSearchQuery(e.target.value)} placeholder='Search by movie title' onFocus={(e) => e.target.select()} />
          <select value={yearQuery} onChange={(e) => updateYearQuery(e.target.value)}>
            <option value="">-- Year select --</option>
            { yearsList.map(year => (
              <option value={year} key={year}>{year}</option>
            ))}
          </select>
          <Button onClick={searchForMovie}>Search</Button>
        </form>
        <AddMovieDialog
          addMovieHandler={addMovieHandler}
        />
      </header>

      <DataTable 
        data={movieList}
        editMovieHandler={editMovieHandler}
        deleteMovieHandler={deleteMovieHandler}
      />

      <Backdrop open={loaderOpen} onClick={handleLoaderClose} style={{ zIndex: 9999, color: 'white' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default App