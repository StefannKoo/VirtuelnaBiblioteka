function dodajModeratora(red){

    console.log(red.id)
    console.log(red)
    fetch('http://localhost:5000/korisnik/dodajAdmin/'+red.id)
    .then(res=>{
        return res.json()
    })
    .then(rez=>{
        azurirajRed(red.id)
    })
    .catch(err=>{
        console.log('Greska:'+err)
    })
}

function azurirajRed(id){
  
   const red= document.getElementsByClassName(id)

   const childs=red[0].children
   console.log(childs)

   childs[2].innerHTML=''
   childs[2].innerHTML=` <b>Admin</b>`

   childs[3].innerHTML=''
   childs[3].innerHTML=`  <span class="text-secondary"><i class="fas fa-users-cog"></i></span>`


}