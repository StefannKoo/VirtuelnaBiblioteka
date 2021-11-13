const db = require('../connection/conn')

module.exports = class Knjiga {

    constructor(naziv, slika, broj_strana, kratak_sadrzaj, autor, godina_objavljivanja, korisnik_id) {
        this.naziv = naziv
        this.slika = slika
        this.broj_strana = broj_strana,
        this.kratak_sadrzaj = kratak_sadrzaj,
        this.autor = autor,
        this.godina_objavljivanja = godina_objavljivanja
        this.korisnik_id = korisnik_id
    }

    async saveKnjiga() {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO knjiga(naziv,slika,broj_strana,korisnik_id,kratak_sadrzaj,autor,godina_objavljivanja) values(?,?,?,?,?,?,?)',
                [this.naziv, this.slika, this.broj_strana, this.korisnik_id,
                this.kratak_sadrzaj, this.autor, this.godina_objavljivanja], (err, rows) => {
                    if (!err) {
                        resolve(rows)
                    }
                    else {
                        reject(err)
                    }
                })
        })
    }

    static async getKnjigaByNaziv(naziv) {
        return new Promise((resolve, reject) => {

            const like = naziv + '%'
            const qveri = 'SELECT * FROM knjiga WHERE naziv LIKE ?'

            db.query(qveri, [like], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }
    static async getKnjigabyId(id) {

        return new Promise((resolve, reject) => {

            const qveri = 'SELECT * FROM knjiga WHERE knjiga_id=?'
            db.query(qveri, [id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })

    }

    static async getAvgOcjenaKnjiga(knjiga_id) {

        return new Promise((resolve, reject) => {

            const qveri = 'SELECT AVG(ocjena) AS prosjek FROM ocjena WHERE knjiga_id=?'

            db.query(qveri, [knjiga_id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })

    }

    static async getKnjigaByPuniNaziv(naziv) {
        return new Promise((resolve, reject) => {
            const qveri = 'SELECT * FROM knjiga WHERE naziv=?'
            db.query(qveri, [naziv], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async saveProcitaoZeliProcitatis(korisnik_id,knjiga_id,procitao,zeli) {
        return new Promise((resolve, reject) => {
            const qveri = 'INSERT INTO procitao_zeli_procitati(korisnik_id,knjiga_id,procitao,zeli_procitati) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE procitao=? ,zeli_procitati=?'

            db.query(qveri,[korisnik_id,knjiga_id,procitao,zeli,procitao,zeli], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async getProcitaneZeliProcitati(korisnik_id,procitao,zeli) {

        return new Promise((resolve, reject) => {
            const qveri = 'SELECT knjiga.knjiga_id, knjiga.naziv,knjiga.slika,knjiga.broj_strana,'
                        +' knjiga.autor,knjiga.godina_objavljivanja FROM knjiga INNER JOIN '
                        +' procitao_zeli_procitati ON knjiga.knjiga_id=procitao_zeli_procitati.knjiga_id'
                        +' WHERE procitao_zeli_procitati.korisnik_id=? AND procitao_zeli_procitati.procitao=? '
                        +' AND procitao_zeli_procitati.zeli_procitati=?'

            db.query(qveri,[korisnik_id,procitao,zeli], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async getAllProcitaneZeliProcitatibyKorisnik_id(korisnik_id) {

        return new Promise((resolve, reject) => {
            const qveri = 'SELECT * FROM procitao_zeli_procitati WHERE korisnik_id=?'

            db.query(qveri,[korisnik_id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }


    static async getKnjigaByNazivOrAutorAndProcitaneZeliProcitatibyKorsnikId(korisnik_id,parametar) {

        return new Promise((resolve, reject) => {

            const like = '%'+parametar + '%'

            const aut='%'+parametar+'%'

            const qveri = 'SELECT knjiga.naziv,knjiga.slika,knjiga.autor,'
                        +' knjiga.godina_objavljivanja,knjiga.knjiga_id ,'
                        +' procitao_zeli_procitati.korisnik_id,procitao_zeli_procitati.procitao, '
                        +' procitao_zeli_procitati.zeli_procitati FROM knjiga LEFT JOIN '
                        +' procitao_zeli_procitati ON knjiga.knjiga_id=procitao_zeli_procitati.knjiga_id '
                        +' AND procitao_zeli_procitati.korisnik_id=? WHERE knjiga.naziv LIKE ? '
                        +' OR knjiga.autor LIKE ? '

            db.query(qveri, [korisnik_id,like,aut], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async getKnjigaByNazivOrAutor(parametar) {

        return new Promise((resolve, reject) => {

            const like = '%'+parametar + '%'

            const aut='%'+parametar+'%'

            const qveri = 'SELECT * FROM knjiga WHERE naziv LIKE ? OR autor LIKE ?'

            db.query(qveri, [like,aut], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }


    static async addKnjigaToList(lista_id,knjiga_id) {

        return new Promise((resolve, reject) => {

            const qveri = 'INSERT INTO lista_knjiga(lista_id,knjiga_id) '
                         +' VALUES(?,?) ON DUPLICATE KEY UPDATE lista_id=? , knjiga_id=?'

            db.query(qveri,[lista_id,knjiga_id,lista_id,knjiga_id], (err, row) => {
                if (!err) {

                    resolve(row.insertId)
                }
                else
                    reject(err)
            })
        })
    }

    static async getKnjigeOnLista(lista_id) {

        return new Promise((resolve, reject) => {

            const qveri = 'SELECT knjiga.knjiga_id, knjiga.naziv, knjiga.autor, knjiga.godina_objavljivanja,knjiga.slika'
            +' FROM knjiga INNER JOIN lista_knjiga ON knjiga.knjiga_id=lista_knjiga.knjiga_id '
            +' WHERE lista_knjiga.lista_id=?'

            db.query(qveri, [lista_id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async getKnjiga_IdOnLista_Id(lista_id) {

        return new Promise((resolve, reject) => {

            const qveri = 'SELECT knjiga_id FROM lista_knjiga WHERE lista_id=? '

            db.query(qveri, [lista_id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async getListsFromKorisnik(korisnik_id) {

        return new Promise((resolve, reject) => {

            const qveri = 'SELECT lista.lista_id,lista.ime_liste,'
            +' knjiga.naziv,knjiga.autor,knjiga.slika FROM lista LEFT JOIN '
            +' lista_knjiga ON lista.lista_id= lista_knjiga.lista_id '
            +' LEFT JOIN knjiga ON lista_knjiga.knjiga_id=knjiga.knjiga_id '
            +' WHERE lista.korisnik_id=? ORDER BY lista.lista_id ASC '

            db.query(qveri, [korisnik_id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async getKnjigeAndImeListaOnListaId(lista_id) {
        return new Promise((resolve, reject) => {
            const qveri = 'SELECT lista.ime_liste, knjiga.naziv, knjiga.autor, knjiga.godina_objavljivanja,'
                          +'knjiga.slika FROM lista LEFT JOIN lista_knjiga '
                          + 'ON lista.lista_id=lista_knjiga.lista_id LEFT JOIN knjiga ON '
                          +' lista_knjiga.knjiga_id=knjiga.knjiga_id WHERE lista.lista_id=?'

            db.query(qveri, [lista_id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async getListsByPretraga(parametar,korisnik_id) {

        return new Promise((resolve, reject) => {
            const like='%'+parametar+'%'
            const qveri = 'SELECT lista.ime_liste,lista.lista_id,lista.javna, knjiga.naziv, '
                         +' knjiga.autor, knjiga.godina_objavljivanja,knjiga.slika '
                         +' FROM lista LEFT JOIN lista_knjiga ON '
                         +' lista.lista_id=lista_knjiga.lista_id LEFT JOIN knjiga '
                         +' ON lista_knjiga.knjiga_id=knjiga.knjiga_id WHERE '
                         +' lista.ime_liste LIKE ? AND lista.javna=1 OR lista.ime_liste '
                         +' LIKE ? AND lista.korisnik_id=? '

            db.query(qveri, [like,like,korisnik_id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

    static async getKnjigeByKorisnikKojiJeUnio(korisnik_id) {
        return new Promise((resolve, reject) => {
            const qveri = 'SELECT * FROM knjiga WHERE korisnik_id=?'

            db.query(qveri, [korisnik_id], (err, row) => {
                if (!err) {
                    resolve(row)
                }
                else
                    reject(err)
            })
        })
    }

}