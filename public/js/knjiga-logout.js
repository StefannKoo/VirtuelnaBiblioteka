function sakrijPrikaziKomentare(el) {

    console.log(el)
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