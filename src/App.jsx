// App.jsx: parte do Integrante 4 (Pedro).
// Junta os componentes, guarda as escolhas e decide a batalha.
import { useState } from 'react';
import BuscaRickMorty from './components/BuscaRickMorty';
import BuscaStarWars from './components/BuscaStarWars';
import SeletorPokemon from './components/SeletorPokemon';
import ArenaClima from './components/ArenaClima';
import Placar from './components/Placar';
import pontosDoTime from './batalha';

import './App.css';

function App() {
  const [liderRick, setLiderRick] = useState(null);
  const [liderStar, setLiderStar] = useState(null);
  const [timeRick, setTimeRick] = useState([]);
  const [timeStar, setTimeStar] = useState([]);
  const [clima, setClima] = useState(null);
  const [batalhou, setBatalhou] = useState(false);

  // Só dá para batalhar com os dois líderes, os dois times completos e o clima
  const pronto =
    liderRick && liderStar && timeRick.length === 3 && timeStar.length === 3 && clima;

  // Cada escolha nova apaga o placar antigo; o novo pede outro clique em BATALHAR
  function escolherLiderRick(novoLider) {
    setLiderRick(novoLider);
    setBatalhou(false);
  }

  function escolherLiderStar(novoLider) {
    setLiderStar(novoLider);
    setBatalhou(false);
  }

  function alterarTimeRick(novoTime) {
    setTimeRick(novoTime);
    setBatalhou(false);
  }

  function alterarTimeStar(novoTime) {
    setTimeStar(novoTime);
    setBatalhou(false);
  }

  function escolherClima(novoClima) {
    setClima(novoClima);
    setBatalhou(false);
  }

  return (
    <>
      <h1>Arena Multiverso</h1>

      <div className="colunas">
        <div className="coluna">
          <BuscaRickMorty lider={liderRick} aoEscolherLider={escolherLiderRick} />
          <SeletorPokemon titulo="Time Rick and Morty" time={timeRick} aoAlterarTime={alterarTimeRick} />
        </div>
        <div className="coluna">
          <BuscaStarWars lider={liderStar} aoEscolherLider={escolherLiderStar} />
          <SeletorPokemon titulo="Time Star Wars" time={timeStar} aoAlterarTime={alterarTimeStar} />
        </div>
      </div>

      <ArenaClima clima={clima} aoEscolherClima={escolherClima} />

      <button className="batalhar" onClick={() => setBatalhou(true)} disabled={!pronto}>
        BATALHAR
      </button>
      {!pronto && <p className="aviso">Escolha os dois líderes, 3 Pokémon em cada time e espere o clima.</p>}

      {/* Só aparece depois do clique; as funções lá de cima o apagam */}
      {batalhou && pronto && (
        <Placar
          nomeRick={liderRick.nome}
          nomeStar={liderStar.nome}
          pontosRick={pontosDoTime(timeRick, timeStar, clima.efeito)}
          pontosStar={pontosDoTime(timeStar, timeRick, clima.efeito)}
        />
      )}
    </>
  );
}

export default App;
