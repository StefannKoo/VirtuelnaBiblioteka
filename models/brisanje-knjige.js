const db = require('../connection/conn')

module.exports = class BrisanjeKnjige{

   static async ObrisiIzProcitaoZeliProcitati(id_knjiga){
        return new Promise((resolve,reject)=>{
            db.query('DELETE FROM procitao_zeli_procitati WHERE knjiga_id=?',[id_knjiga],(err,rows)=>{
                if(!err){
                    resolve(rows.insertId)
                }
                else
                reject(err)
            })
        })
    }

  static  async ObrisiIzOcjena(id_knjiga){
        return new Promise((resolve,reject)=>{
            db.query('DELETE FROM ocjena WHERE knjiga_id=?',[id_knjiga],(err,rows)=>{
                if(!err){
                    resolve(rows.insertId)
                }
                else
                reject(err)
            })
        })
    }

   static async ObrisiIzListaKnjiga(id_knjiga){
        return new Promise((resolve,reject)=>{
            db.query('DELETE FROM lista_knjiga WHERE knjiga_id=?',[id_knjiga],(err,rows)=>{
                if(!err){
                    resolve(rows.insertId)
                }
                else
                reject(err)
            })
        })
    }

   static async ObrisiIKomentarLajkDislajk(id_knjiga){
        return new Promise((resolve,reject)=>{
            db.query('DELETE FROM komentar WHERE knjiga_id=?',[id_knjiga],(err,rows)=>{
                if(!err){
                    resolve(rows.insertId)
                }
                else
                reject(err)
            })
        })
    }

   static async ObrisiIKnjiga(id_knjiga){
        return new Promise((resolve,reject)=>{
            db.query('DELETE FROM knjiga WHERE knjiga_id=?',[id_knjiga],(err,rows)=>{
                if(!err){
                    resolve(rows.insertId)
                }
                else
                reject(err)
            })
        })
    }
    
}