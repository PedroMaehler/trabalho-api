import { useState, useEffect } from 'react';
import Cartao from './Cartao';
import traduzirGenero from '../genero';

const URL_API = 'https://rickandmortyapi.com/api/character';

// Os 10 principais, pedidos pelo número de cada um numa requisição só:
// Rick, Morty, Summer, Beth, Jerry, Birdperson, Evil Morty,
// Mr. Meeseeks, Mr. Poopybutthole e Pickle Rick
const URL_PRINCIPAIS = `${URL_API}/1,2,3,4,5,47,118,242,244,265`;

function BuscaRickMorty({ lider, aoEscolherLider }) {
  const [texto, setTexto] = useState('');
  const [buscado, setBuscado] = useState(''); // vazio = mostrando os principais
  const [personagens, setPersonagens] = useState([]);
  const [total, setTotal] = useState(0); // quantos a API achou (a tela mostra até 10)
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

      if (resposta.status === 404) {
        throw new Error('Nenhum personagem encontrado com esse nome.');
      }
      if (!resposta.ok) {
        throw new Error(`Erro na API (status ${resposta.status})`);
      }

      const dados = await resposta.json();
      // A busca devolve { info, results: [...] }; os principais pedidos por número
      // devolvem a lista direto. O || pega o que existir.
      const lista = dados.results || dados;
      // A busca manda 20 por página; mostramos 10, o mesmo que a do Star Wars
      setPersonagens(lista.slice(0, 10));
      // info.count = quantos a busca achou (os principais não têm info)
      setTotal(dados.info ? dados.info.count : lista.length);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  // Busca TODOS os personagens uma vez, para filtrar enquanto digita.
  // A API não tem uma lista só de nomes: primeiro pergunta quantos existem,
  // depois pede todos pelo número, numa requisição só.
  async function carregarTodos() {
    try {
      const resposta = await fetch(URL_API);
      if (!resposta.ok) {
        throw new Error(`Erro ao carregar a lista completa (status ${resposta.status})`);
      }
      const dados = await resposta.json();

      const numeros = [];
      for (let i = 1; i <= dados.info.count; i++) {
        numeros.push(i);
      }

      const respostaTodos = await fetch(`${URL_API}/${numeros.join(',')}`);
      if (!respostaTodos.ok) {
        throw new Error(`Erro ao carregar a lista completa (status ${respostaTodos.status})`);
      }
      setTodos(await respostaTodos.json());
    } catch (err) {
      // Sem a lista completa, só o filtro não funciona: o botão Buscar continua
      console.log(err.message);
    }
  }

  // Ao abrir o app, busca os principais e a lista completa (uma vez só, por causa do [])
  useEffect(() => {
    carregar(URL_PRINCIPAIS);
    carregarTodos();
  }, []);

  // Busca na API a partir do que o usuário digitou
  function buscar(e) {
    e.preventDefault();
    if (texto.trim() === '') return;
    setBuscado(texto.trim());
    carregar(`${URL_API}/?name=${texto.trim()}`);
    setTexto(''); // limpa o campo: a lista para de filtrar e mostra o resultado da API
  }

  // Volta para os principais
  function limparBusca() {
    setTexto('');
    setBuscado('');
    carregar(URL_PRINCIPAIS);
  }

  // Escolhe o líder e esconde a lista
  function escolher(p) {
    aoEscolherLider({
      id: p.id,
      nome: p.name,
      imagem: p.image,
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
  // Todos os que têm as letras; a lista mostra até 10
  const achados = todos.filter((p) => p.name.toLowerCase().includes(digitado));
  const lista = filtrando ? achados.slice(0, 10) : personagens;

  // Frase acima da lista: diz de onde ela veio e quantos foram achados
  let mensagem = 'Os 10 personagens principais. Para escolher outro, use a busca.';
  let quantos = lista.length;
  if (filtrando) {
    quantos = achados.length;
    mensagem = `Personagens com "${texto.trim()}": ${quantos}`;
  } else if (buscado !== '') {
    quantos = total;
    mensagem = `Resultado da busca por "${buscado}": ${quantos}`;
  }
  // A lista para em 10. Se achou mais, a frase avisa
  if (quantos > lista.length) {
    mensagem = `${mensagem}, mostrando os ${lista.length} primeiros`;
  }

  return (
    <div className="caixa">
      <h2>Rick and Morty</h2>

      <form onSubmit={buscar}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ex.: rick"
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
      {digitado !== '' && todos.length === 0 && <p>Filtro indisponível por enquanto. Use o botão Buscar.</p>}
      {lista.length > 0 && <p className="sucesso">{mensagem}</p>}
      {buscado !== '' && !filtrando && (
        <button className="limpar" onClick={limparBusca}>Limpar busca</button>
      )}

      {lista.map((p) => (
        <Cartao
          key={p.id}
          nome={p.name}
          imagem={p.image}
          detalhe={`Gênero: ${traduzirGenero(p.gender)}`}
          textoBotao="Escolher líder"
          aoClicar={() => escolher(p)}
        />
      ))}
    </div>
  );
}

export default BuscaRickMorty;
