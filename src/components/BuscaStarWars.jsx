import { useState, useEffect } from 'react';
import Cartao from './Cartao';
import traduzirGenero from '../genero';

// Sem parâmetro, este endereço devolve a primeira página: os 10 principais
const URL_API = 'https://swapi.dev/api/people/';

// A SWAPI não manda foto. Esta galeria guarda uma foto para cada personagem
// com o mesmo número que a SWAPI usa no endereço dele.
function imagemDo(url) {
  const id = url.split('/')[5]; // "https://swapi.dev/api/people/4/" -> "4"
  return `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`;
}

function BuscaStarWars({ lider, aoEscolherLider }) {
  const [texto, setTexto] = useState('');
  const [buscado, setBuscado] = useState(''); // vazio = mostrando os principais
  const [personagens, setPersonagens] = useState([]);
  const [todos, setTodos] = useState([]); // todos os personagens, para filtrar enquanto digita
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Faz a requisição e cuida dos três estados: carregando, erro e sucesso
  async function carregar(url) {
    setCarregando(true);
    setErro('');
    setPersonagens([]);

    try {
      const resposta = await fetch(url);

      if (!resposta.ok) {
        throw new Error(`Erro na API (status ${resposta.status})`);
      }

      const dados = await resposta.json();

      // Esta API não devolve 404 quando não acha ninguém:
      // ela responde 200 com a lista vazia.
      if (dados.results.length === 0) {
        throw new Error('Nenhum personagem encontrado com esse nome.');
      }

      setPersonagens(dados.results);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  // Busca TODOS os personagens uma vez, para filtrar enquanto digita.
  // A API entrega 10 por página, e cada página diz onde está a próxima
  // (no campo "next"; na última ele vem null e o while para).
  async function carregarTodos() {
    try {
      const lista = [];
      let url = URL_API;
      while (url) {
        const resposta = await fetch(url);
        if (!resposta.ok) {
          throw new Error(`Erro ao carregar a lista completa (status ${resposta.status})`);
        }
        const dados = await resposta.json();
        for (let i = 0; i < dados.results.length; i++) {
          lista.push(dados.results[i]);
        }
        url = dados.next;
      }
      setTodos(lista);
    } catch (err) {
      // Sem a lista completa, só o filtro não funciona: o botão Buscar continua
      console.log(err.message);
    }
  }

  // Ao abrir o app, busca os principais e a lista completa (uma vez só, por causa do [])
  useEffect(() => {
    carregar(URL_API);
    carregarTodos();
  }, []);

  // Busca na API a partir do que o usuário digitou
  function buscar(e) {
    e.preventDefault();
    if (texto.trim() === '') return;
    setBuscado(texto.trim());
    carregar(`${URL_API}?search=${texto.trim()}`);
    setTexto(''); // limpa o campo: a lista para de filtrar e mostra o resultado da API
  }

  // Volta para os principais
  function limparBusca() {
    setTexto('');
    setBuscado('');
    carregar(URL_API);
  }

  // Escolhe o líder e esconde a lista
  function escolher(p) {
    aoEscolherLider({
      id: p.url,
      nome: p.name,
      imagem: imagemDo(p.url),
      detalhe: `Gênero: ${traduzirGenero(p.gender)}`,
    });
    setPersonagens([]);
    setBuscado('');
    setTexto('');
  }

  // Enquanto digita, a lista mostra os personagens da memória que contêm as letras
  // (sem requisição nenhuma). Sem nada digitado, mostra o que veio da API.
  const digitado = texto.trim().toLowerCase();
  const filtrando = digitado !== '' && todos.length > 0;
  const lista = filtrando
    ? todos.filter((p) => p.name.toLowerCase().includes(digitado)).slice(0, 10)
    : personagens;

  // Frase acima da lista: diz de onde ela veio
  let mensagem = 'Os 10 personagens principais. Para escolher outro, use a busca.';
  if (filtrando) {
    mensagem = `Personagens com "${texto.trim()}": ${lista.length}`;
  } else if (buscado !== '') {
    mensagem = `Resultado da busca por "${buscado}": ${lista.length}`;
  }

  return (
    <div className="caixa">
      <h2>Star Wars</h2>

      <form onSubmit={buscar}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ex.: luke"
        />
        <button type="submit">Buscar</button>
      </form>

      {lider && (
        <Cartao
          nome={lider.nome}
          imagem={lider.imagem}
          detalhe={`Líder escolhido · ${lider.detalhe}`}
          destaque={true}
        />
      )}

      {carregando && <p>Carregando...</p>}
      {erro && !filtrando && <p className="erro">{erro}</p>}
      {filtrando && lista.length === 0 && <p className="erro">Nenhum personagem com esse nome.</p>}
      {lista.length > 0 && <p className="sucesso">{mensagem}</p>}
      {buscado !== '' && !filtrando && (
        <button className="limpar" onClick={limparBusca}>Limpar busca</button>
      )}

      {lista.map((p) => (
        <Cartao
          key={p.url}
          nome={p.name}
          imagem={imagemDo(p.url)}
          detalhe={`Gênero: ${traduzirGenero(p.gender)}`}
          textoBotao="Escolher líder"
          aoClicar={() => escolher(p)}
        />
      ))}
    </div>
  );
}

export default BuscaStarWars;
