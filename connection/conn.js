
const mysql=require('mysql')

const con = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'biblioteka_db'
  });

  con.connect((err)=>{
  if(err){
      console.log('Greska pri konekciji')
  }   
  else
  console.log('Uspjesno ste se konektovali!')
 })

 module.exports=con;