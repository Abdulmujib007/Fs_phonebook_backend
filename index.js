const express = require('express')

const server = express()
server.use(express.json())

let persons = [
    { 
      "id":1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id":2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id":3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id":4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

 server.get('/', (req,res) => {
     res.send('<h1>This is the Phonebook server</h1>')
 })

server.get('/api/persons', (req,res) => {
    res.send(persons)
})
 
server.get(`/api/persons/:id`, (req,res) => {
     const id = Number(req.params.id.replace(':',''))
     const person =persons.find(person => person.id == id)
     if(person){
      res.send(person)
     } else {
       res.status(404).end()
     }
})

server.get('/info', (req,res) => {
  res.send(`<div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>    
  </div>`
  )
})
server.delete('/api/persons/:id', (req,res) => {
  const id  = Number(req.params.id)
   persons =  persons.filter(person => person.id !== id)
   res.status(204).end()
})

const generateId = () => {
  const maxId = Math.max(...persons.map(person => person.id)) + 1
  return maxId

}

 server.post('/api/person',(req,res) => {
   const person = req.body
   person.id = generateId()
   persons = persons.concat(person)
   res.send(person)
 })


server.listen('3001', () => {
    console.log(`server is running on http/localhost:3001`)
})
