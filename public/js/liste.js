window.addEventListener('load',()=>{

    if( document.querySelector('#dodate'))
    document.querySelector('#dodate').click()

    if( document.querySelector('#moje')){
      document.querySelector('#moje').style.textDecoration='underline'
    }

   // prikaziDodate(document.querySelector('#dodate'))
})


const kontejner = document.querySelector('#tabela')

const inputi = document.querySelector('#inp')


function prikaziInput(a) {


    kontejner.innerHTML = ''


    a.style.textDecoration = 'underline'

    a.previousElementSibling.style.textDecoration = 'none'

    inputi.style.display = 'flex'

}


function prikaziDodate(a) {

    a.style.textDecoration = 'underline'

    a.nextElementSibling.style.textDecoration = 'none'

    inputi.style.display = 'none'

    kontejner.innerHTML = ''

    const id_liste = a.parentElement.className

    fetch('http://localhost:5000/korisnik/liste/nova-lista/dodate?id_liste=' + id_liste)
        .then(res => {

            return res.json()

        })
        .then(rez => {

            izlistajDodate(rez.knjige, rez.procitane_lista)

        })
        .catch(err => {
            console.log(err)
        })


}
/**========================= IZLISTAVA DODATE KNJIGE ZA LISTU I ZA SVAKU DA LI JE KORSNIK PROCITAO..================================= */

function izlistajDodate(knjige, procitane_lista) {

    for (var i = 0; i < knjige.length; i++) {
        var flag = 0
        for (var j = 0; j < procitane_lista.length; j++) {
            if (knjige[i].knjiga_id === procitane_lista[j].knjiga_id) {
                if (procitane_lista[j].procitao == 1) {

                    const tbl = `
                        <tr class="bt-2" >
                            <th scope="row">${i + 1}</th>
                            <th class="text-start"><img src="/assets/knjige/${knjige[i].slika}" onclick="window.location='/korisnik/knjiga/${knjige[i].knjiga_id}'" style=" width: 60px; height: 100px;"></th>
                            <td class="colspan-2 text-start"><h5><b>${knjige[i].naziv}</b></h5><br><p>by ${knjige[i].autor}</p></td>
                            <td class="colspan-2 text-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fas fa-check text-primary"></i>
                                    Procitao
                                    </button>
                                    <ul class="dropdown-menu" id="${knjige[i].knjiga_id}">
                                         <li><button  class="dropdown-item" onclick="zelimProcitatiProcitao(this)" type="button">Zelim procitati</button></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        `
                    kontejner.innerHTML += tbl
                    flag = 1

                }
                else {
                    const tbl = `
                    <tr class="bt-2"  >
                        <th scope="row">${i + 1}</th>
                         <th class="text-start"><img src="/assets/knjige/${knjige[i].slika}" onclick="window.location='/korisnik/knjiga/${knjige[i].knjiga_id}'" style=" width: 60px; height: 100px;"></th>
                         <td class="colspan-2 text-start"><h5><b>${knjige[i].naziv}</b></h5><br><p>by ${knjige[i].autor}</p></td>
                         <td class="colspan-2 text-center">
                             <div class="btn-group">
                                 <button type="button" class="btn btn-light  dropdown-toggle"  data-bs-toggle="dropdown" aria-expanded="false">
                                 <i class="fas fa-check  text-warning"></i>
                                 Zelim procitati
                                 </button>
                                 <ul class="dropdown-menu" id="${knjige[i].knjiga_id}">
                                     <li><button  class="dropdown-item" onclick="zelimProcitatiProcitao(this)" type="button">Procitao</button></li>
                                 </ul>
                              </div>
                         </td>
                    </tr>
                     `
                    kontejner.innerHTML += tbl
                    flag = 1

                }

                break
            }

        }
        if (!flag) {
            const tbl = `
                <tr class="bt-2" >
                    <th scope="row">${i + 1}</th>
                     <th class="text-start"><img src="/assets/knjige/${knjige[i].slika}" onclick="window.location='/korisnik/knjiga/${knjige[i].knjiga_id}'" style=" width: 60px; height: 100px;"></th>
                     <td class="colspan-2 text-start"><h5><b>${knjige[i].naziv}</b></h5><br><p>by ${knjige[i].autor}</p></td>
                     <td class="colspan-2 text-center">
                         <div class="btn-group">
                             <button type="button" class="btn btn-info  dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                             Procitao/zelim
                             </button>
                             <ul class="dropdown-menu" id="${knjige[i].knjiga_id}">
                                  <li><button class="dropdown-item" onclick="zelimProcitatiProcitao(this)" type="button">Procitao</button></li>
                                  <li><button  class="dropdown-item" onclick="zelimProcitatiProcitao(this)" type="button">Zelim procitati</button></li>
                             </ul>
                          </div>
                     </td>
                </tr>
        `
            kontejner.innerHTML += tbl
        }

    }
}
/**======================FUNKCIJA KOJA SE POZIVA NA KLIK NA DROPDOWN========================== */

function zelimProcitatiProcitao(btn) {

    const ul = btn.parentElement.parentElement

    const button_mark = ul.previousElementSibling

    const knjiga_id = ul.id

    var procitao
    var zeli_procitati

    if (btn.innerHTML === 'Procitao') {

        procitao = 1
        zeli_procitati = 0
    }
    else if (btn.innerHTML === 'Zelim procitati') {

        procitao = 0
        zeli_procitati = 1

    }

    fetch('http://localhost:5000/korisnik/liste/moje-liste/id', {
        headers: {
            "Content-type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            procitao,
            zeli_procitati,
            knjiga_id

        }
        )
    })
        .then(res => {
            return res.json()
        })
        .then(rez => {
            if (rez) {

                if (procitao && !zeli_procitati) {

                    if(button_mark.classList.contains('btn-info')){

                        button_mark.classList.remove('btn-info')
                        button_mark.classList.add('btn-light')
                    }

                    button_mark.innerHTML = ''
                    button_mark.innerHTML = ` <i class="fas fa-check text-primary"></i>
                                               Procitao`

                    ul.innerHTML = ''
                    ul.innerHTML = `  <li><button  class="dropdown-item" onclick="zelimProcitatiProcitao(this)" type="button">Zelim procitati</button></li>`

                } else {

                    if(button_mark.classList.contains('btn-info')){

                        button_mark.classList.remove('btn-info')
                        button_mark.classList.add('btn-light')
                    }

                    button_mark.innerHTML = ''
                    button_mark.innerHTML = ` <i class="fas fa-check  text-warning"></i>
                                 Zelim procitati`
                    ul.innerHTML = ''
                    ul.innerHTML=`<li><button class="dropdown-item" onclick="zelimProcitatiProcitao(this)" type="button">Procitao</button></li>`

                }

            }
        })
        .catch(err => {
            console.log(err)
        })


}

function pretraziKnjige(btn) {

    const vrijednost = document.querySelector('#pretraga').value

    const id = btn.id

    const lista_id = btn.parentElement.parentElement.nextElementSibling.firstElementChild.id

    fetch('http://localhost:5000/korisnik/liste/nova-lista/search?parametar=' + vrijednost + '&lista_id=' + lista_id)
        .then(res => {
            return res.json()
        })
        .then(rez => {
            generisiKnjige(rez.qvery, rez.knjigeUListi)
        })
        .catch(err => console.log('Greska: ' + err))

}

function generisiKnjige(par, lista) {

    const kontejner = document.querySelector('#tabela')

    kontejner.innerHTML = ''

    let indexi = []

    let br = 0

    if (lista.length > 0) {

        for (var i = 0; i < par.length; i++) {

            for (var j = 0; j < lista.length; j++) {

                if (par[i].knjiga_id === lista[j].knjiga_id) {

                    const tbl = `
                         <tr class="bt-2" id="${par[i].knjiga_id}" >
                              <th scope="row"><img src="/assets/knjige/${par[i].slika}" onclick="window.location='/korisnik/knjiga/${par[i].knjiga_id}'" style=" width: 60px; height: 100px;"></th>
                              <td class="colspan-2"><h5><b>${par[i].naziv}</b></h5> <br> <p>by ${par[i].autor}</p></td>
                              <td class="colspan-2"><button class="btn btn-outline-success" onclick="dodajKnjiguUListu(this)"><i class="fas fa-check"> Dodata</i></button></td>
                         </tr>
                 `
                    kontejner.innerHTML += tbl
                    indexi[br] = i
                    br++

                }

            }
        }

    }

    for (var i = indexi.length - 1; i >= 0; i--) {

        par.splice(indexi[i], 1)
    }


    for (var i = 0; i < par.length; i++) {

        const tbl = `
          <tr class="bt-2" id="${par[i].knjiga_id}" >
               <th scope="row"><img src="/assets/knjige/${par[i].slika}" onclick="window.location='/korisnik/knjiga/${par[i].knjiga_id}'" style=" width: 60px; height: 100px;"></th>
               <td class="colspan-2"><h5><b>${par[i].naziv}</b></h5> <br> <p>by ${par[i].autor}</p></td>
               <td class="colspan-2"><button class="btn bg-success" onclick="dodajKnjiguUListu(this)">Dodaj u listu</button></td>
          </tr>
                  `

        kontejner.innerHTML += tbl

    }

}

function dodajKnjiguUListu(btn) {

    const id_knj = btn.parentElement.parentElement.id

    const id_lista = btn.parentElement.parentElement.parentElement.parentElement.id

    fetch('http://localhost:5000/korisnik/liste/nova-lista/add?id_knj=' + id_knj + '&id_lista=' + id_lista)
        .then(res => {
            return res.json()
        })
        .then(rez => {
            if (rez) {

                btn.classList.remove('bg-success')

                btn.classList.add('btn-outline-success')

                btn.innerHTML = '<i class="fas fa-check"> Dodata</i>'
            }
        })


}

function pretraziListe(btn) {

    const inp = btn.parentElement.previousElementSibling.firstElementChild

    console.log(inp.value)

    window.location = '/korisnik/liste/search?par=' + inp.value

    /*  fetch('http://localhost:5000/korisnik/liste/search?par='+inp.value)
      .then(res=>{
          console.log(res)
      })*/

    inp.value = ''

}


