import express from 'express'
// const express = require('express')

const app = express()

const localhost = 'localhost'
const port = 5343

app.get('/', function(req, res) {
    res.send('<h1>Hello KhaxiDev</h1>')
})

app.listen(port, localhost, () => {
    console.log(`hello I'm AI and running on host: http://${localhost}:${port}/`)
})