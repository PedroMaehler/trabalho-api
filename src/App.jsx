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

  return (
    <>
      <h1>Arena Multiverso</h1>

      <div className="colunas">
        <div className="coluna">
          <BuscaRickMorty lider={liderRick} aoEscolherLider={setLiderRick} />
          <SeletorPokemon titulo="Time Rick and Morty" time={timeRick} aoAlterarTime={setTimeRick} />
        </div>
        <div className="coluna">
          <BuscaStarWars lider={liderStar} aoEscolherLider={setLiderStar} />
          <SeletorPokemon titulo="Time Star Wars" time={timeStar} aoAlterarTime={setTimeStar} />
        </div>
      </div>

      <ArenaClima clima={clima} aoEscolherClima={setClima} />

      <button className="batalhar" onClick={() => setBatalhou(true)} disabled={!pronto}>
        BATALHAR
      </button>
      {!pronto && <p className="aviso">Escolha os dois líderes, 3 Pokémon em cada time e espere o clima.</p>}

      {/* O placar é calculado na hora com os dados atuais: se alguém trocar
          um Pokémon depois de batalhar, o resultado acompanha */}
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
