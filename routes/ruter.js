const { Router } = require('express')
const ekspres=require('express')

const router=ekspres.Router()

const db=require('../connection/conn')

const controller=require('../controller/controler')

const verify=require('../middleware/authMidlw')

router.get('/',verify.verifyToken,controller.getIndex)

router.get('/registracija',verify.verifyToken,controller.getRegistration)

router.post('/register',controller.saveKorisnik)

router.get('/prijava',verify.verifyToken,controller.prijava)

router.get('/logout',controller.Logout)

router.get('/korisnik',verify.verifyKorisnik,controller.getKorisnik)

router.post('/prijava',controller.prijavaPost)

router.get('/korisnik/knjiga/:id',controller.getKnjiga)

router.get('/korisnik/obrisi-knjigu/:id',controller.deleteKnjiga)

//router.get('/korisnik/pretrazi/:id',controller.searchKnjiga)
//Ovo sam ovim
router.get('/korisnik/pretrazi',controller.searchKnjiga)

router.get('/korisnik/dodajAdmin',verify.verifyAdmin,controller.addAdminPage)

router.get('/korisnik/dodajAdmin/:id',verify.verifyAdmin,controller.addAdmin)

router.post('/korisnik/knjiga/:id/ocjena',controller.saveOcjena)

router.post('/korisnik/knjiga/:id/komentar',controller.addKomentar)

router.post('/korisnik/knjiga/:id/replyNaKomentar',controller.addReply)

router.get('/korisnik/dodajKnjigu',verify.verifyAdmin,controller.addKnjiga)

router.post('/korisnik/dodajknjigu',controller.addKnjigaPost)

router.post('/korisnik/knjiga/id/lajk-dislajk',controller.lajkDislajkkKnjiga)

router.post('/knjiga',controller.knjigaLogout)

router.get('/knjiga',(req,res)=>{res.redirect('/')})

router.get('/korisnik/procitao-zeli-procitati',verify.verifyKorisnik,controller.procitaoKnjigu)

router.get('/korisnik/lista-procitane',verify.verifyKorisnik,controller.izlistajProcitane)

router.get('/korisnik/lista-zeli-procitati',verify.verifyKorisnik,controller.izlistajZeliProcitati)

router.get('/korisnik/liste',verify.verifyKorisnik,controller.getListe)

router.get('/korisnik/liste/nova',verify.verifyKorisnik,controller.addLista)

router.post('/korisnik/liste/nova',controller.addListaSave)

router.get('/korisnik/liste/nova-lista/search',verify.verifyKorisnik,controller.searchNovaListaKnjiga)

router.get('/korisnik/liste/nova-lista/add',verify.verifyKorisnik,controller.addKnjigaNovaLista)

router.get('/korisnik/liste/nova-lista/dodate',verify.verifyKorisnik,controller.getKnjigeNovaLista)

router.get('/korisnik/liste/search',verify.verifyKorisnik,controller.searchListe)

router.get('/korisnik/liste/moje-liste',verify.verifyKorisnik,controller.getUsersLists)

router.get('/korisnik/liste/moje-liste/:id',verify.verifyKorisnik,controller.getListaById)

router.post('/korisnik/liste/moje-liste/:id',verify.verifyKorisnik,controller.postProcitaoZeli)

router.get('/korisnik/profil',controller.getProfile)

module.exports=router