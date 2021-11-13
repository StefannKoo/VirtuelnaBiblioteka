

async function pretraziKnjigeInput() {

    input = document.querySelector('#inp1').value

    window.location = '/korisnik/pretrazi?par=' + input

}

function procitaoZeliProc(btn) {

    event.stopPropagation()

    const id = btn.parentElement.classList[2]

    var zeli = (btn.innerText == ' Procitao') ? false : true

    fetch('http://localhost:5000/korisnik/procitao-zeli-procitati?id=' + id + '&zeli=' + zeli)
        .then(res => {
            return res.json()
        })
        .then(rez => {
            if (rez) {
                if (zeli) {

                    btn.innerHTML = ''
                    btn.innerHTML = ` <i class="fas fa-check text-primary"></i>
                                Zelim Procitati`

                    btn.nextElementSibling.innerHTML = `<i class="fas fa-book  butn"> Procitao</i>`
                }
                else {

                    btn.innerHTML = ''
                    btn.innerHTML = ` <i class="fas fa-check text-primary"></i>
                                     Procitao`

                    btn.previousElementSibling.innerHTML =`<i
                                      class="fas fa-book-reader  butn"> Zelim procitati</i>`

                }
            }

        })
        .catch(err => {
            console.log(err)
        })
}

function obrisiKnjigu(knjiga){

    event.stopPropagation()

    const id_knjige=knjiga.parentElement.classList[2]

    let answer=confirm('Da li zelite da obriste knjigu?')

    if(answer){

        fetch('http://localhost:5000/korisnik/obrisi-knjigu/'+id_knjige)
        .then(res=>{
            return res.json()
        })
        .then(rez=>{
            if(rez){

                const kontejner=document.querySelector('#knjige')

                kontejner.removeChild(document.getElementById(id_knjige))

            }

        })
        .catch(err=>{
            console.log(err)
        })
       
    }

}


