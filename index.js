require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const server = express()
server.use(express.json())
server.use(express.static('build'))

morgan.token('response', function (req) {
  return JSON.stringify(req.body)
})

server.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :response'
  )
)

server.use(cors())

const errorHandler = (error, request, response, next) => {
  console.error({errorhandler:error.message})

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if(error.name === 'ValidationError') {
    return response.status(400).json({error:error.message})
  }

  next(error)
}


  
server.put('/api/persons/:id', (req,res,next) => {
  const newUpdate = req.body
  const newPerson = {
    name: newUpdate.name,
    number:newUpdate.number
  }
  console.log(newPerson)
  Person.findByIdAndUpdate(req.params.id,newPerson,{new:true,runValidators:true})
    .then(updatedPerson => {
      res.send(updatedPerson)
    })
    .catch(err => next(err))
})

server.get('/api/persons/:id', (req, res,next) => {
  const id = req.params.id
  Person.findById(id).then((person) => {
    if(person) res.send(person)
    else  res.status(404).end()  
     
  })
    .catch(error => next(error))
})

server.delete('/api/persons/:id', (req, res) => {
  const deleteid = req.params.id
  return Person.findByIdAndRemove(deleteid).then((deletedOne) => {
    if(deletedOne) res.status(204).end()
    else res.status(409).send({error:'id not found'})
  })
})
   


server.post('/api/persons', (req, res,next) => {
  const peeps = req.body
  console.log(peeps)
  if (peeps.name && peeps.number) {
    const person = new Person({
      name: peeps.name,
      number: peeps.number,
    })
    person.save().then((savedPerson) => {
      res.send(savedPerson)
    })
      .catch(err => next(err))
  } else res.status(400).end()
})

server.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(persons)
  })
})

server.get('/info', (req, res) => {
  res.send(`<div>
  <p>Phonebook has info for ${Person.length} people</p>
  <p>${new Date()}</p>    
  </div>`)
})

server.get('/', (req, res) => {
  res.send('<h1>This is the Phonebook server</h1>')
})


server.use(errorHandler)


const PORT = process.env.PORT || 5050
server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`)
})
