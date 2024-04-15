const express = require('express')
const app = express()
app.use(express.json())
const sqlite3 = require('sqlite3')
const path = require('path')
const {open} = require('sqlite')

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null
const initilizeDBAndServer = async () => {
  try {
    db = await open({filename: dbPath, driver: sqlite3.Database})

    app.listen(3000, () => {
      console.log('Server Running')
    })
  } catch (e) {
    console.log(`DB Error:${e.message}`)
    process.exit(1)
  }
}

initilizeDBAndServer()

//get movie names

app.get('/movies/', async (request, response) => {
  const getMovieNamesQuery = `SELECT movie_name FROM movie `

  const movieNamesArray = await db.all(getMovieNamesQuery)

  response.send(
    movieNamesArray.map(eachMovie => {
      return {movieName: eachMovie.movie_name}
    }),
  )
})

//create new movie

app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails

  const addMovieQuery = `INSERT INTO movie(director_id,movie_name,lead_actor)
  VALUES(${directorId},${movieName},${leadActor})`
  const dbResponse = await db.run(addMovieQuery)
  response.send('Movie Successfully Added')
})
