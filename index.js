const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
require('dotenv').config()

const server = express();

server.use(express.json());
server.use(express.static('build'))

morgan.token('response', function(req,res){return JSON.stringify(req.body)})

server.use(morgan(':method :url :status :res[content-length] - :response-time ms :response'));

server.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = Math.max(...persons.map((person) => person.id)) + 1;
  return maxId;
};



server.get(`/api/persons/:id`, (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id == id);
  if (person) {
    res.send(person);
  } else {
    res.status(404).end();
  }
});

server.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

server.post("/api/persons", (req, res) => {
  const person = req.body;
  console.log(person);
  if (persons.find((item) => item.name === person.name)) {
    res.send({ error: "name must be unique" });
  }
  if (person.number && person.name) {
    person.id = generateId();
    persons = persons.concat(person);
    res.send(person);
  } else res.status(400).end();
});

server.get("/api/persons", (req, res) => {
  res.send(persons);
});

server.get("/info", (req, res) => {
  res.send(`<div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>    
  </div>`);
});


server.get("/", (req, res) => {
  res.send("<h1>This is the Phonebook server</h1>");
});

const PORT = process.env.PORT || 5050
server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
