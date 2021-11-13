const ekspres= require('express')
const app=ekspres()

const cookie_parser=require('cookie-parser')

const ruter=require('./routes/ruter')

const fileUpload=require('express-fileupload')

app.use(fileUpload())

app.use(cookie_parser())

app.use(ekspres.urlencoded({ extended:false}))
app.use(ekspres.json())

app.use(ekspres.static(__dirname+'/public'))

app.set('view engine','ejs') 

app.use('/',ruter)

app.listen(5000,()=>{
    console.log('Uspjesno ste logovano na server')
})