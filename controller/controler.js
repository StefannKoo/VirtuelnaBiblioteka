
const Korisnik = require('../models/korisnik')
const Knjiga = require('../models/knjiga')
const Komentar = require('../models/komentar')
const BrisanjeKnjige = require('../models/brisanje-knjige')

const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')
const con = require('../connection/conn')



const token = (id) => {
    return jwt.sign({ id }, 'tajna-123', {
        expiresIn: 100000
    })
}


/**=====================PRETRAGA KNJIGE KADA NIJE KORISNIK PRIJAVLJEN========================= */

exports.knjigaLogout = async (req, res) => {

    if (req.body.knjiga) {

        const knjiga = await Knjiga.getKnjigaByPuniNaziv(req.body.knjiga).catch(err => console.log(err))

        var knjigaObjekat = Object.values(JSON.parse(JSON.stringify(knjiga)))

        var id

        try {
            id = knjiga[0].knjiga_id
        }
        catch (err) {
            console.log(err)
        }

        if (id) {

            /**=========================SVI GLAVNI KOENTARI TJ KOJI NISU ODG=================================== */

            const komentari = await Komentar.getAllCommentsNotPatent(id).catch(err => console.log(err))


            /**=========================SVI ODGOVORI NA KOM ZA DATU KNJIGU=================================== */

            var odg

            try {
                odg = await Komentar.getAllCommentsPatent(id)
            }
            catch (err) {
                console.log(err)
            }

            /**=========================PROSJECNA OCJENA ZA DATU KNJ=================================== */

            const ocjena = await Knjiga.getAvgOcjenaKnjiga(id).catch(err => console.log(err))

            var prosjecna_ocjena = Object.values(JSON.parse(JSON.stringify(ocjena)))[0].prosjek

            /**=========================BROJ LAJKOVA I DISLAJKOVA ZA SVAKI KOMENTAR=================== */

            const nizLajkDislajk = await Komentar.getNumberLikeDislike().catch(err => console.log(err))


            res.render('knjigaLogout', {
                knjiga: knjiga,
                komentari,
                odg,
                prosjecna_ocjena,
                nizLajkDislajk
            })


        }
        else {

            res.redirect('/')

        }
    }
    else {
        res.redirect('/')
    }

}

var nadimak
var slika
var isAdmin
var id_korisnik

exports.getKorisnik = async (req, res) => {

    const kolacic = req.cookies.kolacic

    const verifikacija = jwt.verify(kolacic, 'tajna-123');

    const korisnik = await Korisnik.getKorisnikById(verifikacija.id)

    var korisnikObjekat = Object.values(JSON.parse(JSON.stringify(korisnik)))

    nadimak = korisnikObjekat[0].nadimak

    slika = korisnikObjekat[0].slika

    isAdmin = korisnikObjekat[0].administrator

    id_korisnik = korisnikObjekat[0].korisnik_id

    const putanja_do_slike = path.join(__dirname, '../slike', slika)

    var rezultat = ''

    res.render('korisnik', {
        nadimak,
        slika,
        isAdmin,
        input: true,
        adminPage: false,
        rezultat
    })
}

exports.getIndex = (req, res) => {
    res.render('index')
}

exports.getRegistration = (req, res) => {
    res.render('registracija')
}

exports.prijava = (req, res) => {

    res.render('prijava')
}

//------REGISTRACIJA NOVOG KORISNIKA----//

exports.saveKorisnik = async (req, res) => {

    const { ime, prezime, datum, nadimak, sifra } = req.body
    let kriptovanaSifra
    try {

        const salt = await bcrypt.genSalt(10)
        kriptovanaSifra = await bcrypt.hash(sifra, salt)
    }
    catch (err) {
        console.log('Greska' + err)
    }
    let sampleFile;
    let putanjaZaSlike;

    sampleFile = req.files.slika;

    /*  putanjaDoFoldera = path.join(__dirname, '../slike')*/ //nacin da se dodje do drugog foldera
    putanjaDoFoldera = path.join(__dirname, '../public/assets/citaoci')

    putanjaZaSlike = putanjaDoFoldera + '/' + sampleFile.name

    console.log(kriptovanaSifra)
    sampleFile.mv(putanjaZaSlike, (err) => {
        if (err) {
            console.log(err)
        }
    })

    const citalac = new Korisnik(ime, prezime, sampleFile.name, datum, nadimak, kriptovanaSifra);

    const id = await citalac.saveKorisnik();
    if (id) {

        const t = token(id)
        res.cookie('kolacic', t, {

            maxAge: 100000 * 60 * 60,
            httpOnly: true
        })
        res.redirect('/korisnik')
    }
}


//************* PRIJAVA KORISNIKA NA SISTEM ****************/

exports.prijavaPost = async (req, res) => {

    const nadimak1 = req.body.nadimak
    const sifra1 = req.body.sifra


    try {

        const rows = await Korisnik.chechKorisnik(nadimak1);

        let nadimak;
        let sifra;
        let id;

        rows.forEach(element => {
            nadimak = element.nadimak
            sifra = element.sifra
            id = element.korisnik_id
        });

        const uporedi = await bcrypt.compare(sifra1, sifra)

        if (uporedi) {
            const t = token(id)

            res.cookie('kolacic', t, {
                maxAge: 100000 * 60 * 60,
                httpOnly: true
            })

            res.redirect('/korisnik')
        }
        else res.redirect('/prijava')
    }
    catch (err) {
        console.log('Greska' + err)
        res.redirect('/prijava')
    }


}

exports.Logout = (req, res) => {
    res.clearCookie('kolacic')
    res.redirect('/')
}

var id_knjiga

/**=========================PREGLED STRANICE O KNJIZI=================================== */
/**===================================================================================== */

exports.getKnjiga = async (req, res) => {

    id_knjiga = req.params.id

    /**=========================DOHVACANJE TRAZENE KNJIGE IZ BAZE=================================== */

    const knjiga = await Knjiga.getKnjigabyId(id_knjiga)

    /**=========================PROVJERA DA LI JE LOGOVANI KORISNIK OCJENIO KNJ===================== */
    /**=========================DRUGI NACIN ZA TRY CATCH U ISTOM REDU=================================== */

    const ocjenaKnjiga = await Korisnik.provjeriOcjenuKorisnik(id_korisnik, id_knjiga).catch(err => {
        console.log(err)
    })

    /**=========================DA BI SE PRISTUPILO PODACIMA(ROW DATA PAKET)================================== */
    const ocjObjekat = Object.values(JSON.parse(JSON.stringify(ocjenaKnjiga)))

    var ocjenaBroj

    if (ocjObjekat.length > 0) {

        ocjenaBroj = ocjObjekat[0].ocjena
    }
    else {
        ocjenaBroj = 0
    }

    /**=========================SVI GLAVNI KOENTARI TJ KOJI NISU ODG=================================== */

    const komentari = await Komentar.getAllCommentsNotPatent(id_knjiga)


    /**=========================SVI ODGOVORI NA KOM ZA DATU KNJIGU=================================== */

    var odg

    try {
        odg = await Komentar.getAllCommentsPatent(id_knjiga)
    }
    catch (err) {
        console.log(err)
    }

    /**=========================PROSJECNA OCJENA ZA DATU KNJ=================================== */

    const ocjena = await Knjiga.getAvgOcjenaKnjiga(id_knjiga).catch(err => console.log(err))

    var prosjecna_ocjena = Object.values(JSON.parse(JSON.stringify(ocjena)))[0].prosjek

    /**=========================BROJ LAJKOVA I DISLAJKOVA ZA SVAKI KOMENTAR=================== */

    const nizLajkDislajk = await Komentar.getNumberLikeDislike().catch(err => console.log(err))

    res.render('knjiga', {
        knjiga: knjiga,
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        ocjenaBroj,
        komentari,
        odg,
        prosjecna_ocjena,
        nizLajkDislajk
    })
}

/**=========================PRETRAGA KNJIGA=================================== */
/**============================================================================ */

exports.searchKnjiga = async (req, res) => {

    const par = req.query.par

    try {
        var rezultat

        if (par) {

            rezultat = await Knjiga.getKnjigaByNazivOrAutorAndProcitaneZeliProcitatibyKorsnikId(id_korisnik, par)

        }
        else
            rezultat = ''

        res.render('korisnik', {
            nadimak,
            slika,
            isAdmin,
            input: true,
            adminPage: false,
            rezultat
        })

    }

    catch (err) {

        console.log(err)
    }


}

/**=========================STRANICA ZA DODAVANJE ADMINA=================================== */

exports.addAdminPage = async (req, res) => {

    try {

        /**=========================SVI KORISNICI IZ BAZE=================================== */

        const korisnici = await Korisnik.getAllKorsnik();

        res.render('dodaj-admina', {
            nadimak,
            slika,
            isAdmin,
            input: true,
            adminPage: true,
            korisnici
        })

    }
    catch (err) {
        console.log(err)
    }

}

/**=========================DODAVANJE ADMINA U BAZU=================================== */

exports.addAdmin = (req, res) => {

    const id = req.params.id

    try {

        const uspjesno = Korisnik.addAdmin(id)
        res.json('Uspjesno')

    }
    catch (err) {
        res.json('Neuspjesno')
    }

}

/**=========================CUVANJE OCJENE NA PROMJENU U BAZU=================================== */

exports.saveOcjena = async (req, res) => {

    const par = req.body.ocjena

    var ocjena

    switch (par) {
        case 'prva':
            ocjena = 1;
            break;
        case 'druga':
            ocjena = 2
            break;
        case 'treca':
            ocjena = 3
            break;
        case 'cetvrta':
            ocjena = 4
            break;
        case 'peta':
            ocjena = 5
            break;

        default:
            break;
    }

    /**========================DIO ZA UPISIVANJE ILI PROMJENU OCJENE U TABELI OCJENA=================== */

    const upit = await Korisnik.insertUpdateOcjena(id_korisnik, id_knjiga, ocjena)

    /**========================DIO ZA UZIMANJE SVIH OCJENA ZA KNJIGU I VRACANJE PROSJEKA=================== */

    const avgOcjena = await Knjiga.getAvgOcjenaKnjiga(id_knjiga)

    res.json({
        avgOcjena
    })


}

/**=========================STRANOCA ZA DODAVANJE NOVE KNJIGE=================================== */

exports.addKnjiga = (req, res) => {
    res.render('dodaj-knjigu')
}

/**=========================CUVANJE KNJIGE U BAZU=================================== */

exports.addKnjigaPost = async (req, res) => {

    const { naziv, autor, god, opis, br_strana } = req.body

    let sampleFile
    let putanjaZaSlike;

    sampleFile = req.files.slika;

    /**=========================CUVANJE SLIKE U FOLDERU KNJIGE=================================== */

    putanjaDoFoldera = path.join(__dirname, '../public/assets/knjige')

    putanjaZaSlike = putanjaDoFoldera + '/' + sampleFile.name

    sampleFile.mv(putanjaZaSlike, (err) => {
        if (err) {
            console.log(err)
        }
    })

    /**=================NOVA INSTANCA KNJIGE I CUVANJE U BAZI I REDIRECT NA KORISNIK STR============= */

    try {

        const knjiga = new Knjiga(naziv, sampleFile.name, br_strana, opis, autor, god, id_korisnik)

        const sacuvano = await knjiga.saveKnjiga()

        res.redirect('/korisnik')
    }
    catch (err) {
        console.log(err)

    }
}

exports.addKomentar = async (req, res) => {

    const tekst = req.body.text

    try {

        const koment = new Komentar(id_knjiga, id_korisnik, tekst)

        const sacuvan = await koment.saveKomentar()

        /*************KADA SE SACUVA UZIMA IZ BAZE PODATKE O TOM KOMENTARU*********** */

        var sacuvanKomentar
        try {
            sacuvanKomentar = await Komentar.getCommentsbyId(sacuvan)
        }
        catch (err) {

            console.log(err)
        }

        console.log(sacuvanKomentar)
        res.json({
            nadimak,
            slika,
            sacuvanKomentar
        })
    }
    catch (err) {

        console.log(err)
    }

}

exports.addReply = async (req, res) => {

    const { patent_komentar_id, tekst } = req.body

    const komentarOdgovor = new Komentar(id_knjiga, id_korisnik, tekst, patent_komentar_id)

    const sacuvanOdg = await komentarOdgovor.saveKomentar()

    const komentar = await Komentar.getCommentsbyId(sacuvanOdg)

    var Objekat = Object.values(JSON.parse(JSON.stringify(komentar)))


    res.json({
        nadimak,
        slika,
        komentar
    })


}

/***==================DIO ZA LAJK DISLAJK============================== */

exports.lajkDislajkkKnjiga = async (req, res) => {

    const { tip, id_komentara } = req.body

    var lajk = null
    var dislajk = null

    /**===============U ZAVISNOSTI OD KOMBINACIJE GENERISE LAJK I DISLAJK=================== */

    switch (tip) {

        case 'LajkDa':
            lajk = 1
            dislajk = 0
            break;

        case 'DislajkDa':
            lajk = 0
            dislajk = 1
            break;

        default:
            lajk = 0
            dislajk = 0
            break;
    }

    const uspjesno = await Komentar.saveUpdateLikeDislike(id_korisnik, id_komentara, lajk, dislajk).catch(err => console.log(err))

    res.json(uspjesno)


}

/**=======================DA LI JE PROCITAO ILI ZELI DA PROCITA KNJ======================== */

exports.procitaoKnjigu = async (req, res) => {

    const { id, zeli } = req.query

    var procitao
    var zeli_procitati

    if (zeli === 'true') {
        procitao = 0
        zeli_procitati = 1
    }
    if (zeli === 'false') {
        procitao = 1
        zeli_procitati = 0
    }

    try {

        const procitaoSave = await Knjiga.saveProcitaoZeliProcitatis(id_korisnik, id, procitao, zeli_procitati)

        res.json(true)

    }
    catch (err) {

        res.json(false)

    }

}

exports.izlistajProcitane = async (req, res) => {

    const lista = await Knjiga.getProcitaneZeliProcitati(id_korisnik, 1, 0).catch(err => console.log(err))


    res.render('listaKnjiga', {
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        lista
    })

}

exports.izlistajZeliProcitati = async (req, res) => {

    const lista = await Knjiga.getProcitaneZeliProcitati(id_korisnik, 0, 1).catch(err => console.log(err))

    res.render('listaKnjiga', {
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        lista
    })

}
var uspjesno = 0

var ime_liste

var id_liste

exports.getListe = (req, res) => {

    res.render('liste', {
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        uspjesno,
        ime_liste,
        id_liste,
        moje_liste: ''
    })
    uspjesno = 0
}

exports.addLista = (req, res) => {

    res.render('dodaj-listu', {
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        uspjesno,
        ime_liste,
        id_liste
    })
    uspjesno = 0
}
exports.addListaSave = async (req, res) => {


    const { ime, exampleRadios } = req.body

    var javna

    if (exampleRadios === 'privatna')
        javna = 0
    else
        javna = 1

    const dodataLista = await Korisnik.dodajNovuListu(id_korisnik, javna, ime).catch(err => console.log(err))

    id_liste = dodataLista

    uspjesno = 1

    ime_liste = ime

    res.redirect('/korisnik/liste')
}

exports.searchNovaListaKnjiga = async (req, res) => {

    const { parametar, lista_id } = req.query

    const qvery = await Knjiga.getKnjigaByNazivOrAutor(parametar).catch(err => console.log(err))

    const knjigeUListi = await Knjiga.getKnjiga_IdOnLista_Id(lista_id).catch(err => console.log(err))

    res.json({ qvery, knjigeUListi })

}

exports.addKnjigaNovaLista = async (req, res) => {

    const { id_knj, id_lista } = req.query

    try {

        const ubacena = await Knjiga.addKnjigaToList(id_lista, id_knj);

        res.json(true)


    }
    catch (err) {

        res.json(false)

        console.log(err)

    }

}
/**==================== IZLISTAVA SVE KNJIGE IZ LISTE ======================= */
exports.getKnjigeNovaLista = async (req, res) => {

    const { id_liste } = req.query

    try {

        const knjige = await Knjiga.getKnjigeOnLista(id_liste)

        /**==================== SVE KNJIGE KOJE KORISNIK JE PROC ILI ZELI PROC = ============================ */
        /**==================== SLUZI DA BI SE U JS GENERISALI BTN-I KOJE JE KNJ =========
         * ===================== PROCITAO A KOJE ZELI PR ============================ */

        const procitane_lista = await Knjiga.getAllProcitaneZeliProcitatibyKorisnik_id(id_korisnik).catch(err => console.log(err))


        res.json({
            knjige,
            procitane_lista
        })

    }
    catch (err) {

    }
}
/** =============== PRETRAGA LISTA(ZAVRSITI) ======?????????=========== */


exports.searchListe = async (req, res) => {

    const { par } = req.query

    const moje_liste = await Knjiga.getListsByPretraga(par, id_korisnik).catch(err => console.log(err))

    res.render('liste-search', {
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        uspjesno,
        ime_liste,
        id_liste,
        moje_liste
    })

}

/**========== LISTE KOJE JE KORISNIK KREIRAO============ */

exports.getUsersLists = async (req, res) => {

    const moje_liste = await Knjiga.getListsFromKorisnik(id_korisnik).catch(err => console.log(err))

    res.render('liste', {
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        uspjesno,
        ime_liste,
        id_liste,
        moje_liste
    })

}

/**================= MOJA LISTA PRETRAGA PO ID(PREGLED LISTE) ================= */

exports.getListaById = async (req, res) => {


    const rezultat = await Knjiga.getKnjigeAndImeListaOnListaId(req.params.id).catch(err => (console.log('Greska:' + err)))


    const ime_liste = rezultat[0].ime_liste

    const id_liste = req.params.id

    res.render('lista-prikaz', {
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        ime_liste,
        id_liste,
    })
}

exports.postProcitaoZeli = async (req, res) => {

    const { procitao, zeli_procitati, knjiga_id } = req.body

    try {

        const save_param = await Knjiga.saveProcitaoZeliProcitatis(id_korisnik, knjiga_id, procitao, zeli_procitati)

        res.json(true)

    }
    catch (err) {

        res.json(false)

    }

}

exports.deleteKnjiga = async (req, res) => {

    const id = req.params.id

    const prva = await BrisanjeKnjige.ObrisiIzProcitaoZeliProcitati(id).catch(err => console.log(err))
    const druga = await BrisanjeKnjige.ObrisiIzOcjena(id).catch(err => console.log(err))
    const treca= await BrisanjeKnjige.ObrisiIzListaKnjiga(id).catch(err=>console.log(err))
    const peta=await BrisanjeKnjige.ObrisiIKomentarLajkDislajk(id).catch(err=>console.log(err))
    const sesta=await BrisanjeKnjige.ObrisiIKnjiga(id).catch(err=>console.log(err))

    res.json(true)

}

exports.getProfile= async (req,res)=>{

    const podaci= await Korisnik.getKorisnikById(id_korisnik).catch(err=>console.log(err))

    const dodao_knjige=await Knjiga.getKnjigeByKorisnikKojiJeUnio(id_korisnik).catch(err=>console.log(err))


    res.render('moj-profil',{
        slika,
        nadimak,
        isAdmin,
        input: true,
        adminPage: false,
        podaci,
        dodao_knjige
    })
}

