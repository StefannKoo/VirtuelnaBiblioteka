const jwt = require('jsonwebtoken')
const db = require('../connection/conn')

//***************UKOLIKO POSTOJI KOLACIC I UKOLIKO JE VALIDAN RENDERUJE KORISNIK*****************
//***************U SVAKOM DRUGOM SLUCAJU INDE NEXT TJ IDE NORMALNO KAKO JE PREDVIDJENO************* */

const verifyToken = (req, res, next) => {

  const kolacic = req.cookies.kolacic

  if (!kolacic) {
    next()
  }
  else {
    jwt.verify(kolacic, 'tajna-123', (err, dt) => {
      if (err) {
        next()
      }
      else {

        res.redirect('/korisnik')
      }

    })
  }
}

const verifyKorisnik = (req, res, next) => {

  const kolacic = req.cookies.kolacic

  if (!kolacic) {
    res.redirect('/')
  }
  else {
    jwt.verify(kolacic, 'tajna-123', (err, dt) => {
      if (err) {
        res.redirect('/')
      }
      else {
        next()
      }
    })
  }

}

const verifyAdmin = (req, res, next) => {

  const kolacic = req.cookies.kolacic

  if (!kolacic) {
    res.redirect('/')
  }
  else {
    jwt.verify(kolacic, 'tajna-123', (err, dt) => {
      if (err) {
        res.redirect('/')
      }
      else {
        db.query('SELECT administrator FROM korisnik WHERE korisnik_id=?', [dt.id], (err, row) => {
          if (err) {
            console.log(err)
          }
          else {
            if (row[0].administrator === 1) {
              next()
            }
            else {
              res.redirect('/')
            }
          }
        })
      }
    })
  }

}

module.exports = { verifyToken, verifyKorisnik, verifyAdmin }