// As duas APIs mandam o gênero em inglês, e cada uma escreve de um jeito:
// o Rick manda "Male", o Star Wars manda "male". O toLowerCase() iguala os dois
// e o objeto traduz.
const GENEROS = {
  male: 'Masculino',
  female: 'Feminino',
  genderless: 'Sem gênero', // Rick: alguns alienígenas
  none: 'Sem gênero',       // Star Wars
  'n/a': 'Sem gênero',      // Star Wars: os robôs (R2-D2, C-3PO)
  hermaphrodite: 'Hermafrodita',
  unknown: 'Desconhecido',
};

function traduzirGenero(genero) {
  return GENEROS[genero.toLowerCase()] || 'Não informado';
}

export default traduzirGenero;
