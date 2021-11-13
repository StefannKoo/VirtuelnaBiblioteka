
window.addEventListener('load', () => {
    const prva = document.getElementById('prva')
    const druga = document.getElementById('druga')
    const treca = document.getElementById('treca')
    const cetvrta = document.getElementById('cetvrta')
    const peta = document.getElementById('peta')
});

/*=====================DIO ZA KOMENTARE===================================== */

//document.querySelector(".zvjezdice").addEventListener('mouseleave', ponisti)

//**************ZA SKRIVANJE I PRIKAZIVANJE ODOVORA NA KOMENTARE PRI KLIKU NA COMMENTS*********************** */
var bool = false;

function sakrijPrikaziKomentare(el) {

    const parent = el.parentElement

    const sibling = parent.nextElementSibling

    const repli_na_komentar_div = sibling.firstElementChild

    const polje_za_komentar = sibling.lastElementChild

    const repli_na_komentar = repli_na_komentar_div.children

    bool = !bool;

    if (repli_na_komentar.length < 1) {

        if (bool)
            polje_za_komentar.style.display = 'block'
        else
            polje_za_komentar.style.display = 'none'
    }
    else if ((repli_na_komentar[0].style.display == 'none' || polje_za_komentar.style.display == 'none')) {

        for (var i = 0; i < repli_na_komentar.length; i++) {
            repli_na_komentar[i].style.display = 'flex'
        }
        polje_za_komentar.style.display = 'block'
    }
    else {


        for (var i = 0; i < repli_na_komentar.length; i++) {
            repli_na_komentar[i].style.display = 'none'
        }
        polje_za_komentar.style.display = 'none'
    }
}
//******************PRIKAZIVANJE BTN-A DODAJ KOMENTAR KADA JE POLJE U FOKUSU**************** */
/*******************U SUPROTNOM SKRIVANJE DUGMETA******************************************* */

function prikaziDugme(ta) {

    ta.nextElementSibling.style.display = 'block'

    ta.addEventListener('focusout', () => {

        ta.nextElementSibling.style.display = 'none'

    })
}


function prikaziZaOdgovor(btn) {

    const kontejner = btn.parentElement

    const sibling = kontejner.nextElementSibling

    const repli_na_komentar = sibling.firstElementChild

    const polje_za_komentar = sibling.lastElementChild

    if (sibling.lastElementChild.style.display == 'none') {

        sibling.lastElementChild.style.display = 'block'
    }
    else {
        sibling.lastElementChild.style.display = 'none'
    }


    console.log(polje_za_komentar)

}

//*****************DODAVANJE OBICNOG KOMENTARA**************** */

function dodajKomentar(k) {


    const text_area = k.parentElement.previousElementSibling

    const text_area_vr = k.parentElement.previousElementSibling.value

    const div = document.createElement('div')

    fetch('http://localhost:5000/korisnik/knjiga/id/komentar', {
        headers: {
            "Content-type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            text: k.parentElement.previousElementSibling.value
        }
        )
    })
        .then(res => {
            return res.json()
        })
        .then(rez => {

            div.setAttribute('id', rez.sacuvanKomentar[0].komentar_id)

            const date = new Date(rez.sacuvanKomentar[0].vrijeme)

            const string = ' ' + 0

            const komentar = `  <div class="border-top mt-5 row justify-content-center"
                                     style="width: 100%; height:auto; " id="komentar">
                                    <div class="col-2 text-center mt-2">
                                        <img src="/assets/citaoci/${rez.slika}" alt="" class="img-fluid " style="border-radius: 50%;width: 60px; height: 60px;">
                                    </div>
                                    <div class="col-10 mt-2" style="overflow-wrap: break-word;">
                                            <div class="row">
                                            <p class="lead text-secondary col-4" >${rez.nadimak}</p>
                                            <div class="col-3"></div>
                                            <p class="text-secondary col-5"  >${date.toDateString()}</p><br>
                                            </div>
                                        ${text_area_vr}
                                    </div>
                                    <div class="row mt-4">
                                        <div class="col-7"></div>
                                        <button class="col-1 far fa-thumbs-up" id="lajk" onclick="lajkDislajk(this)"></button>
                                        <button class="col-1 far fa-thumbs-down" id="dislajk" onclick="lajkDislajk(this)"></button>
                                        <button onclick="sakrijPrikaziKomentare(this)"
                                            class="col-2 far fa-comments ${rez.sacuvanKomentar[0].komentar_id}>">${string}</button>
                                        <button class="col-1 fas fa-reply" onclick="prikaziZaOdgovor(this)"></button>
                        
                                    </div>



                                    <div class="" id="k" style="width: 95%; margin-left: 100px; ">
                                        <div id="odgovori">

                                        </div>

                                        <div class="row mb-3 mt-3" id="unos" style="display: none;">
                                            <textarea class="col-12 my-auto" onfocus="prikaziDugme(this)"
                                                onfocusout="sakrijDugme(this)" placeholder="Unesite odgovor..." name=""
                                                id="txt" cols="30" rows="1"></textarea>
                                            <div style="position: relative; height: 20px; margin-top: 10px; display: none;">
                                                <button onmousedown="dodajReplyNaKomentar(this)"
                                                    style="position: absolute;  right: 0; bottom: 0;"
                                                    class="bg-outline-primary">Dodaj
                                                    Komentar</button>
                                            </div>
                                        </div>                
                                    </div>
                                </div>`

            div.innerHTML = komentar

            document.querySelector('#kontejner').prepend(div)

            text_area.value = ''

        })
        .catch(err => {
            console.log(err)
        })


    //overflow-wrap css da se izbjegne dugacak string u jednom redu

}

/**======================DIO ZA OCJENLJIVANJE======================= */

//******************SABLON FUNKCIJA KOJA VRACA LOGIKU KAD KOJE ZVJEZDICE SVJETLE********************* */

function osvjetliZvjezdiceSablon(par) {

    const id = par.id

    console.log(id)

    switch (id) {
        case 'prva':
            prva.classList.add('checked')
            druga.classList.remove('checked')
            treca.classList.remove('checked')
            cetvrta.classList.remove('checked')
            peta.classList.remove('checked')
            break;
        case 'druga':
            prva.classList.add('checked')
            druga.classList.add('checked')
            treca.classList.remove('checked')
            cetvrta.classList.remove('checked')
            peta.classList.remove('checked')
            break;
        case 'treca':
            prva.classList.add('checked')
            druga.classList.add('checked')
            treca.classList.add('checked')
            cetvrta.classList.remove('checked')
            peta.classList.remove('checked')
            break;
        case 'cetvrta':
            prva.classList.add('checked')
            druga.classList.add('checked')
            treca.classList.add('checked')
            cetvrta.classList.add('checked')
            peta.classList.remove('checked')
            break;
        case 'peta':
            prva.classList.add('checked')
            druga.classList.add('checked')
            treca.classList.add('checked')
            cetvrta.classList.add('checked')
            peta.classList.add('checked')
            break;
        default:
            break;

    }
}

//************FUNKCIJA KOJA SE POZIVA KADA JE MIS IZNAD ZVJEZICE****************** */

function osvjetliZvjezdice(zvjezdica) {

    osvjetliZvjezdiceSablon(zvjezdica)
}


//***************OCJENJIVANJE KNJIGE, KADA SE PRVI PUT KLIKNE ODUZIMA SE LISTENER****************** */
//***************ZA KADA MIS NAPUSTI DIV SA ZVJEZDICAMA I ODUZIMA SE LISTENER ZA****************** */
//***************ONMOUSEOVER IZ HTML ZA SVAKU ZVJEZDICU POSEBNO PA VISE NECE OSV-****************** */
//***************JETLJAVATI KADA SE MISEM PREDJE PREKO NJE, ZA SVAKI NAREDNI KLIK ****************** */
/****************OSVJETLI SAMO ZVJEZDICE KOJE TREBA DA OSVJETLI TJ OCJENU    *********************** */

//****************TREBA DODATI FETCH ZA SLANJE OCJENE**************** */
function ocjeniKnjigu(par) {

    var bool = 0

    bool++;


    fetch('http://localhost:5000/korisnik/knjiga/id/ocjena', {
        headers: {
            "Content-type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            ocjena: par.id
        }
        )
    })
        .then(res => {
            return res.json()
        })
        .then(rez => {

            document.querySelector('#ocjena').innerHTML = `Ocjena:<i><b>
                                                                ${rez.avgOcjena[0].prosjek.toFixed(2)}
                                                                     </b></i>`                                                    

            osvjetliZvjezdiceSablon(par)     

            console.log('Do bool'+bool)
            if (bool === 1 && document.querySelector('#zvjezdice').hasAttribute('onmouseleave')) {

                document.querySelector('#zvjezdice').removeAttribute('onmouseleave')

                console.log('Dosloooo '+bool)

                const zvj = document.querySelector('#zvjezdice').children

                for (var i = 0; i < zvj.length; i++) {
                   zvj[i].removeAttribute('onmouseover')
                }
            }
            
        })



    /*  if (bool == 1) {
          document.querySelector('#zvjezdice').removeAttribute('onmouseleave')
  
          const zvj = document.querySelector('#zvjezdice').childNodes
  
          for (var i = 0; i < zvj.length; i++) {
              zvj[i].onmouseover = null
          }
      }
      // else
      osvjetliZvjezdiceSablon(par)*/

}

/*****************KADA MIS NAPUSTI PROSTOR KONTEJNERA GDJE SE ZVJEZDICE NALAZE UKLANJA KLASU CHEKED********* */
function ponisti() {

    prva.classList.remove('checked')
    druga.classList.remove('checked')
    treca.classList.remove('checked')
    cetvrta.classList.remove('checked')
    peta.classList.remove('checked')
}

//*****************DODAJE ODGOVOR  NA KOMENTAR *************************** */

function dodajReplyNaKomentar(par) {


    const parent = par.parentElement.parentElement

    const text = par.parentElement.previousElementSibling.value

    const previous_sibling = parent.previousElementSibling

    const id_komentara = parent.parentElement.parentElement.parentElement.id


    fetch('http://localhost:5000/korisnik/knjiga/id/replyNaKomentar', {
        headers: {
            "Content-type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            patent_komentar_id: id_komentara,
            tekst: text,

        }
        )
    })
        .then(res => {
            return res.json()
        })
        .then(rez => {

            console.log('Reply'+rez)

            const div = document.createElement('div')

            div.setAttribute('id', rez.komentar[0].komentar_id)

            div.classList.add('row', 'mt-3')

            div.style.display = 'flex'

            const btn = document.getElementsByClassName(id_komentara)



            var br;

            try {
                br = parseInt(btn.innerHTML)
                br++;
                btn.innerHTML = ' ' + br

            }
            catch (err) {
                console.log(err)
            }


            const txt = ` 
                                <div class="col-2 text-center mt-2">
                                    <img src="/assets/citaoci/${rez.slika}" alt="" style=" border-radius: 50%;width: 60px; height: 60px;" class="img-fluid ">
                                </div>
                                <div class="col-10">
                                    <p class="lead text-secondary">${rez.nadimak}</p>
                                    ${text}
                                </div>
                                <div class="row">
                                    <div class="col-10"></div>
    
                                    <button class="col-1 far fa-thumbs-up" id="lajk" onclick="lajkDislajk(this)"></button>
                                    <button class="col-1 far fa-thumbs-down" id="dislajk" onclick="lajkDislajk(this)"></button>
                                </div>
                        `


            div.innerHTML = txt

            previous_sibling.appendChild(div)

            par.parentElement.previousElementSibling.value = ''
        })

}

//*====================LOGIKA ZA LAJK DISLAJK =========================== */

function lajkDislajk(par) {

    const btn = par.id

    /**=================UPRAVLJANJE NA FRONTU SA LAJK DISLAJK LOGIKOM============== */

    if (btn == 'lajk') {

        var br = Number(par.innerHTML)
        if (par.classList.contains('far')) {
            br++;
            par.innerHTML = br.toString()
            par.classList.remove('far')
            par.classList.add('fas')

            const disl = par.nextElementSibling

            if (disl.classList.contains('fas')) {

                var vr = Number(disl.innerHTML)
                vr--;

                disl.innerHTML = vr
                disl.classList.remove('fas')
                disl.classList.add('far')
            }
        }
        else {
            br--;
            par.innerHTML = br.toString()
            par.classList.remove('fas')
            par.classList.add('far')
        }
    }
    else {

        var br = Number(par.innerHTML)
        if (par.classList.contains('far')) {
            br++;
            par.innerHTML = br.toString()
            par.classList.remove('far')
            par.classList.add('fas')

            const xlajk = par.previousElementSibling

            if (xlajk.classList.contains('fas')) {

                var vr = Number(xlajk.innerHTML)
                vr--;

                xlajk.innerHTML = vr
                xlajk.classList.remove('fas')
                xlajk.classList.add('far')
            }
        }
        else {
            br--;
            par.innerHTML = br.toString()
            par.classList.remove('fas')
            par.classList.add('far')
        }
    }

    var id_komentara = null

    if (par.parentElement.parentElement.classList.contains('border-top')) {

        id_komentara = par.parentElement.parentElement.parentElement.id
    }
    else {

        id_komentara = par.parentElement.parentElement.id
    }

    /**=================DA LI JE LAJK IL DISLAJK I DA LI SE POVECAVA IL SMANJUJE BT LAJKOVA I DISL========= */
    /**=================VEZANO ZA UPIS U BAZU=============================== */
    var tip = null

    if (btn == 'lajk') {

        if (par.classList.contains('fas')) {

            tip = 'LajkDa'
        }
        else

            tip = 'LajkNe'
    }
    else if (btn == 'dislajk') {

        if (par.classList.contains('fas')) {

            tip = 'DislajkDa'
        }
        else

            tip = 'DislajkNe'
    }

    fetch('http://localhost:5000/korisnik/knjiga/id/lajk-dislajk', {
        headers: {
            "Content-type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            tip,
            id_komentara
        }
        )
    })
        .then(res => {
            return res.json()
        })
        .then(rez => {
            console.log(rez)
        })
        .catch(err => console.log(err))

}