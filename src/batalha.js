// Motor de batalha (parte do Pedro).
// A regra de pontos é a que o grupo definiu: imune 0, resiste 1, neutro 2, vantagem 4.

// Pontos de UM tipo atacando UM tipo defensor, pela tabela real da PokéAPI
function pontosDoAtaque(relacao, tipoDefensor) {
  if (relacao.nada.includes(tipoDefensor)) return 0;
  if (relacao.dobro.includes(tipoDefensor)) return 4;
  if (relacao.metade.includes(tipoDefensor)) return 1;
  return 2;
}

// Quanto o clima multiplica os ataques de um tipo
function multiplicadorDoClima(tipo, efeito) {
  if (efeito.bonus.includes(tipo)) return 1.5;
  if (efeito.penalidade.includes(tipo)) return 0.5;
  return 1;
}

// Cada um dos dois tipos do atacante ataca os dois tipos de cada adversário.
// O clima vale por tipo: um Pokémon fogo/voador na chuva tem o fogo
// enfraquecido e o voador normal.
function pontosDoPokemon(atacante, adversarios, efeito) {
  let total = 0;
  for (let i = 0; i < 2; i++) {
    const multiplicador = multiplicadorDoClima(atacante.tipos[i], efeito);
    for (let j = 0; j < adversarios.length; j++) {
      const defensor = adversarios[j];
      for (let k = 0; k < 2; k++) {
        total += pontosDoAtaque(atacante.relacoes[i], defensor.tipos[k]) * multiplicador;
      }
    }
  }
  return total;
}

// Soma os pontos dos 3 Pokémon de um time contra o time adversário
function pontosDoTime(time, adversarios, efeito) {
  let total = 0;
  for (let i = 0; i < time.length; i++) {
    total += pontosDoPokemon(time[i], adversarios, efeito);
  }
  return total;
}

export default pontosDoTime;
