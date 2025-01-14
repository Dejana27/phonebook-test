const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": "5",
        "name": "Laura Abramov", 
        "number": "39-23-6453122"
      }
]

app.get('/api/persons', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.json(persons);
})
app.get('/api/info', (request, response) => {
    const numOfEntries = persons.length
    const time = new Date()
    const entries = `<p>Phonebook has info for ${numOfEntries} people</p>  <p>${time}</p>`
    response.send(entries)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.floor(Math.random() * 100) : 0
    return String(maxId + 1);
}
app.post('/api/persons', (request, response) => {
    const body = request.body
    const personsToShow = persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase())
    if(personsToShow.length > 0) {
        return response.status(400).json({
            error: "Name must be unique"
        })
    }
    if(!body.name) {
        return response.status(400).json({
            error: "Name is missing"
        })
    } else if(!body.number) {
        return response.status(400).json({
            error: "Number is missing"
        })
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateId(),
        }
        persons = persons.concat(person)
        response.json(person)
    }
    
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})
