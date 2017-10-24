const any = '[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]'
const vowel = '[аеёиоуыэюя]'
const consonant = '[бвгджзклмнпрстфхцчшщ]'
const sign = '[йъь]'
const shy = '&shy;' // '\xAD'
const nonBreakingHyphen = '&#8209;'

const preposiciones = {
  corto: 'и|а|в|к|у|с|о|не|но|на|из|от|об|до|по',
  largo: 'над|под|как'
}

const patterns = {

  common: [
    [new RegExp(' (-|–|—) ', 'g'), '&nbsp;&mdash; '],
    [new RegExp(' {2}', 'g'), ' '],
    [new RegExp('-(й|я|е) ', 'g'), `${nonBreakingHyphen}$1 `], // TODO TESTS
    [new RegExp('-(й|я|е) ', 'g'), `${nonBreakingHyphen}$1$nbsp;`], // TODO TESTS
    [new RegExp(` (${preposiciones.corto}) `, 'gi'), ' $1&nbsp;'],
    [new RegExp(`\&nbsp\;(${preposiciones.corto}) `, 'gi'), '&nbsp;$1&nbsp;'], 
    [new RegExp(`^(${preposiciones.corto}) `, 'gi'), '$1&nbsp;']
  ],

  digits: [
    [new RegExp(' (\\d+) ', 'g'), '&nbsp;$1&nbsp;'],
    [new RegExp('\&nbsp\;(\\d+) ', 'g'), '&nbsp;$1&nbsp;'] // TODO TESTS
  ],

  digitsR: [
    [new RegExp(' (\\d+) ', 'g'), ' $1&nbsp;']
  ],

  header: [
    [new RegExp(` (${preposiciones.largo}) `, 'gi'), ' $1&nbsp;']
  ],
  // Регулярные выражения для переносов взяты
  // c http://vyachet.ru/hyphen-russian-html-text/
  hyphens: [
    [new RegExp(`(${sign})(${any}${any})`, 'ig'), `$1${shy}$2`],
    [new RegExp(`(${vowel})(${vowel}${any})`, 'ig'), `$1${shy}$2`],
    [new RegExp(`(${vowel}${consonant})(${consonant}${vowel})`, 'ig'), `$1${shy}$2`],
    [new RegExp(`(${consonant}${vowel})(${consonant}${vowel})`, 'ig'), `$1${shy}$2`],
    [new RegExp(`(${vowel}${consonant})(${consonant}${consonant}${vowel})`, 'ig'), `$1${shy}$2`],
    [new RegExp(`(${vowel}${consonant}${consonant})(${consonant}${consonant}${vowel})`, 'ig'), `$1${shy}$2`]
  ]
}

const defaults = {
  hyphens: false,
  digits: false,
  digitsR: false,
  header: false
}

// typo :: String -> Object -> String
export default function typo(s, options = defaults) {
  if (s == null || typeof s != 'string') {
    return s
  }

  const P = Object.keys(patterns).reduce((acc, key) => {
    return options[key] ? acc.concat(patterns[key]) : acc
  }, patterns.common)

  return P.reduce((acc, p) => acc.replace(p[0], p[1]), s)
}
