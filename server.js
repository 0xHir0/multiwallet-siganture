const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const wallets = require('./routes/api/wallet')
const cors = require('cors')

const resolvePath = require('path').resolve

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(resolvePath(__dirname, './build')))

// app.use(cors({
//   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));
// DB Config
const db = require('./config/keys').mongoURI

// Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected ..!'))
  .catch((err) => {
    console.log(err)
  })

// Use Routes
app.use('/api', wallets)

app.get('/*', (req, res) => {
  const contents = fs.readFileSync(
    resolvePath(__dirname, './build/index.html'),
    'utf8',
  )
  res.send(contents)
})

const port = process.env.PORT || 5000

app.listen(port, () => `Server running on port ${port} 🔥`)
