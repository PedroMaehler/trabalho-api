import { useState, useEffect } from 'react';

const URL_API = 'https://api.open-meteo.com/v1/forecast';

const CIDADES = [
  { nome: 'Cuiabá', lat: -15.601, lon: -56.097 },
  { nome: 'Manaus', lat: -3.119, lon: -60.021 },
  { nome: 'São Paulo', lat: -23.55, lon: -46.633 },
  { nome: 'Cairo', lat: 30.044, lon: 31.235 },
  { nome: 'Reykjavik', lat: 64.146, lon: -21.942 },
  { nome: 'Tóquio', lat: 35.676, lon: 139.65 },
  { nome: 'Londres', lat: 51.507, lon: -0.127 },
];

// Transforma o clima real em efeito na batalha: bônus x1.5 e penalidade x0.5.
// O código do tempo segue a tabela WMO: 51 a 99 é chuva, menos 71 a 77, que é neve.
function classificar(temperatura, vento, codigo) {
  const neve = codigo >= 71 && codigo <= 77;
  if (codigo >= 51 && !neve) {
    return { nome: '🌧️ Chuva', bonus: ['water', 'electric', 'bug'], penalidade: ['fire', 'ground', 'rock'] };
  }
  if (temperatura <= 14 || neve) {
    return { nome: '❄️ Frio', bonus: ['ice', 'water', 'psychic', 'steel'], penalidade: ['grass', 'bug', 'dragon', 'flying'] };
  }
  if (vento >= 22) {
    return { nome: '💨 Vento forte', bonus: ['flying', 'dragon', 'electric', 'psychic'], penalidade: ['fighting', 'bug', 'grass'] };
  }
  if (temperatura >= 26 || codigo === 0) {
    return { nome: '☀️ Calor', bonus: ['fire', 'grass', 'ground', 'rock'], penalidade: ['water', 'ice'] };
  }
  return { nome: '⛅ Ameno', bonus: ['normal', 'fighting', 'fairy'], penalidade: ['ghost', 'dark'] };
}

function ArenaClima({ clima, aoEscolherClima }) {
  const [cidade, setCidade] = useState(CIDADES[0]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Faz a requisição e cuida dos três estados: carregando, erro e sucesso
  async function carregar(c) {
    setCidade(c);
    setCarregando(true);
    setErro('');
    aoEscolherClima(null); // sem clima, a batalha não usa o da cidade anterior

    try {
      const resposta = await fetch(
        `${URL_API}?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      if (!resposta.ok) {
        throw new Error(`Erro na API (status ${resposta.status})`);
      }

      const dados = await resposta.json();
      const atual = dados.current_weather;
      aoEscolherClima({
        cidade: c.nome,
        temperatura: atual.temperature,
        vento: atual.windspeed,
        efeito: classificar(atual.temperature, atual.windspeed, atual.weathercode),
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  // Sorteia uma posição de 0 a 6 e busca o clima daquela cidade
  function sortear() {
    const posicao = Math.floor(Math.random() * CIDADES.length);
    carregar(CIDADES[posicao]);
  }

  // Ao abrir o app, busca o clima de Cuiabá (uma vez só, por causa do [])
  useEffect(() => {
    carregar(CIDADES[0]);
  }, []);

  return (
    <div className="caixa">
      <h2>Arena: clima real</h2>

      <div className="cidades">
        <button onClick={sortear} disabled={carregando}>🎲 Sortear arena</button>
        {CIDADES.map((c) => (
          <button
            key={c.nome}
            onClick={() => carregar(c)}
            disabled={carregando}
            className={c.nome === cidade.nome ? 'ativa' : ''}
          >
            {c.nome}
          </button>
        ))}
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="erro">{erro}</p>}

      {clima && (
        <div className="sucesso">
          <p>
            {clima.cidade}: {clima.temperatura}°C, vento {clima.vento} km/h, {clima.efeito.nome}
          </p>
          <p>Bônus x1.5: {clima.efeito.bonus.join(', ')}</p>
          <p>Penalidade x0.5: {clima.efeito.penalidade.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default ArenaClima;
