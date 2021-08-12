console.log(process.argv)
 const mongosse = require('mongoose')
  require('dotenv').config()

 if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }

  const password = process.argv[2]

  const url = `mongodb+srv://firstdb:${password}@cluster0.tsal5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

  mongosse.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

  const personSchema = new mongosse.Schema({
      name:String,
      number:String
  })
  const Person = mongosse.model('Person',personSchema)

 

  const person = new Person({
    name: process.argv[3],
    number:process.argv[4]
  })


    if(process.argv.length > 3){
        person.save().then(result => {
            console.log('person saved!')
            mongosse.connection.close()
          })
    }
 if(process.argv.length === 3){
    Person.find({}).then(result => {
        result.forEach(per => {
            console.log(per)
        })
        mongosse.connection.close()
    })
 }
  
