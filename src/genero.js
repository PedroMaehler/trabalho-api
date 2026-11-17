// As duas APIs mandam o gênero em inglês, e cada uma escreve de um jeito:
// o Rick manda "Male", o Star Wars manda "male". O toLowerCase() iguala os dois
// e o objeto traduz.
const GENEROS = {
  male: 'Masculino',
  female: 'Feminino',
  genderless: 'Sem gênero', 
  none: 'Sem gênero',       
  'n/a': 'Sem gênero',      
  hermaphrodite: 'Hermafrodita',
  unknown: 'Desconhecido',
};

function traduzirGenero(genero) {
  return GENEROS[genero.toLowerCase()] || 'Não informado';
}

export default traduzirGenero;
