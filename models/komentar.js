const db = require('../connection/conn')

module.exports = class Komentar {

    constructor(knjiga_id, korisnik_id, tekst, patent) {
        this.knjiga_id = knjiga_id,
            this.korisnik_id = korisnik_id,
            this.tekst = tekst,
            this.patent = patent
    }

    async saveKomentar() {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO komentar(knjiga_id,korisnik_id,tekst,patent_komentar_id) VALUES(?,?,?,?)',
                [this.knjiga_id, this.korisnik_id, this.tekst, this.patent], (err, rows) => {
                    if (!err) {
                        resolve(rows.insertId)
                    }
                    else {
                        reject(err)
                    }
                })
        })
    }

    static async getAllCommentsNotPatent(knjiga_id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT korisnik.nadimak,korisnik.slika,komentar.tekst,komentar.komentar_id, '
                + 'date(komentar.vrijeme) AS vrijeme FROM komentar INNER JOIN korisnik ON '
                + ' komentar.korisnik_id=korisnik.korisnik_id WHERE komentar.knjiga_id=? '
                + 'AND patent_komentar_id IS NULL ORDER BY komentar.vrijeme DESC',
                [knjiga_id], (err, rows) => {
                    if (!err) {
                        resolve(rows)
                    }
                    else {
                        reject(err)
                    }
                })
        })
    }

    static async getAllCommentsPatent(knjiga_id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT korisnik.nadimak,korisnik.slika,komentar.tekst,komentar.komentar_id, '
                + 'komentar.patent_komentar_id,date(komentar.vrijeme) '
                + ' AS vrijeme FROM komentar INNER JOIN korisnik ON komentar.korisnik_id=korisnik.korisnik_id '
                + 'WHERE komentar.knjiga_id=? AND komentar.patent_komentar_id IS NOT NULL ORDER BY komentar.vrijeme ASC',
                [knjiga_id], (err, rows) => {
                    if (!err) {
                        resolve(rows)
                    }
                    else {
                        reject(err)
                    }
                })
        })
    }

    static async getCommentsbyId(komentar_id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM komentar WHERE komentar_id=?',
                [komentar_id], (err, rows) => {
                    if (!err) {
                        resolve(rows)
                    }
                    else {
                        reject(err)
                    }
                })
        })
    }

    static async saveUpdateLikeDislike(korisnik_id, komentar_id, lajk, dislajk) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO lajk_dislajk(korisnik_id,komentar_id,lajk,dislajk) VALUES(?,?,?,?)'
                + ' ON DUPLICATE KEY UPDATE lajk=? , dislajk=?',
                [korisnik_id, komentar_id, lajk, dislajk, lajk, dislajk],
                (err, rows) => {
                    if (!err) {
                        resolve(rows.insertId)
                    }
                    else {
                        reject(err)
                    }
                })
        })
    }

    /**===========================SUMA LAJKOVA I DISLAJKOVA ZA SVAKI KOMENTAR============================= */

    static async getNumberLikeDislike() {
        return new Promise((resolve, reject) => {
            db.query('SELECT komentar_id, SUM(lajk) AS likes,SUM(dislajk) AS dislikes from lajk_dislajk GROUP BY komentar_id',
                (err, rows) => {
                    if (!err) {
                        resolve(rows)
                    }
                    else {
                        reject(err)
                    }
                })
        })
    }


}