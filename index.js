require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const server = express();

server.use(express.json());
server.use(express.static("build"));

morgan.token("response", function (req, res) {
  return JSON.stringify(req.body);
});

server.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :response"
  )
);

server.use(cors());

server.get(`/api/persons/:id`, (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    res.send(person);
  });
});

server.delete("/api/persons/:id", (req, res) => {
  const deleteid = req.params.id;
  Person.findByIdAndRemove(deleteid).then((deleted) => {
    res.status(204).end();
  });
});

server.post("/api/persons", (req, res) => {
  const peeps = req.body;
  console.log(peeps);
  if (peeps.name && peeps.number) {
    const person = new Person({
      name: peeps.name,
      number: peeps.number,
    });
    person.save().then((savedPerson) => {
      res.send(savedPerson);
    });
  } else res.status(400).end();
});

server.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(persons);
  });
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

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
