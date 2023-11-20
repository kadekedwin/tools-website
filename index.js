const express = require('express')
// const favicon = require('serve-favicon');

const app = express()
const port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const imageToAscii = require("./image-to-ascii.js");
app.use('/image-to-ascii', imageToAscii)

// 404 Page
app.use((req, res) => {
    res.status(404).send("404")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})