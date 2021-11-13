
const db = require('../connection/conn')

module.exports = class Korisnik {

    constructor(ime, prezime, slika, datum, nadimak, sifra) {
        this.ime = ime
        this.prezime = prezime
        this.slika = slika
        this.datum = datum
        this.nadimak = nadimak
        this.sifra = sifra
        this.administrator = 0
    }
    async saveKorisnik() {

        return new Promise((resolve, reject) => {
            db.query('INSERT INTO korisnik(administrator,ime,prezime,slika,datum_rodjenja,nadimak,sifra) VALUES(?,?,?,?,?,?,?)',
                [this.administrator, this.ime, this.prezime, this.slika, this.datum, this.nadimak, this.sifra], (err, rows) => {
                    if (!err) {
                        resolve(rows.insertId)
                    }
                    else {
                        reject(err)
                    }
                })
        })

    }
    static async chechKorisnik(nadimak) {

        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM korisnik WHERE nadimak=?', [nadimak],
                (err, rows) => {
                    if (!err) {
                        resolve(rows)
                    }
                    else reject('Greska')
                })
        })

    }
    static async getKorisnikById(id){
        return new Promise((resolve,reject)=>{
            db.query('SELECT * FROM korisnik WHERE korisnik_id=?',[id],(err,res)=>{
                if(!err){
                    resolve(res)
                }
                else
                reject(err)
            })
        })
    }
    static async getAllKorsnik(){
        return new Promise((resolve,reject)=>{
            db.query('SELECT * FROM korisnik ',(err,res)=>{
                if(!err){
                    resolve(res)
                }
                else
                reject(err)
            })
        })
    }

    static async addAdmin(id){
        return new Promise((resolve,reject)=>{
            db.query('UPDATE korisnik  SET administrator=1 WHERE korisnik_id=?',[id],(err,res)=>{
                if(!err){
                    resolve(res)
                }
                else
                reject(err)
            })
        })
    }

    static async insertUpdateOcjena(kor,knj,ocj){
        return new Promise((resolve,reject)=>{
            db.query('INSERT INTO ocjena(korisnik_id,knjiga_id,ocjena) VALUES(?,?,?) ON DUPLICATE KEY UPDATE ocjena=?',[kor,knj,ocj,ocj],(err,res)=>{
                if(!err){
                    resolve(res)
                }
                else
                reject(err)
            })
        })
    }

    static async provjeriOcjenuKorisnik(kor,knj){
        return new Promise((resolve,reject)=>{
            db.query('SELECT ocjena FROM ocjena WHERE korisnik_id=? AND knjiga_id=?',[kor,knj],(err,res)=>{
                if(!err){
                    resolve(res)
                }
                else
                reject(err)
            })
        })
    }

    static async dodajNovuListu(korisnik,javna,ime){
        return new Promise((resolve,reject)=>{
            db.query('INSERT INTO  lista(ime_liste,korisnik_id,javna) VALUES(?,?,?)',[ime,korisnik,javna],(err,res)=>{
                if(!err){
                    resolve(res.insertId)
                }
                else
                reject(err)
            })
        })
    }


    









}