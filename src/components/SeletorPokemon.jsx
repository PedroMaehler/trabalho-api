import { useState, useEffect } from 'react';
import Cartao from './Cartao';

const URL_API = 'https://pokeapi.co/api/v2/pokemon';

function SeletorPokemon({ titulo, time, aoAlterarTime }) {
  const [texto, setTexto] = useState('');
  const [todosNomes, setTodosNomes] = useState([]); // nomes de todos, para sugerir enquanto digita
  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Faz a requisição e cuida dos três estados: carregando, erro e sucesso
  async function carregar(nome) {
    setCarregando(true);
    setErro('');
    setPokemon(null);

    try {
      const resposta = await fetch(`${URL_API}/${nome}`);
      if (resposta.status === 404) {
        throw new Error('Nenhum Pokémon encontrado com esse nome.');
      }
      if (!resposta.ok) {
        throw new Error(`Erro na API (status ${resposta.status})`);
      }
      const dados = await resposta.json();

      // Segunda consulta, uma por tipo: contra quem esse tipo é forte ou fraco
      const tipos = [];
      const relacoes = [];
      for (let i = 0; i < dados.types.length; i++) {
        const item = dados.types[i];
        const respostaTipo = await fetch(item.type.url);
        if (!respostaTipo.ok) {
          throw new Error(`Erro ao buscar o tipo ${item.type.name}`);
        }
        const tipo = await respostaTipo.json();
        tipos.push(item.type.name);
        relacoes.push({
          dobro: tipo.damage_relations.double_damage_to.map((t) => t.name),
          metade: tipo.damage_relations.half_damage_to.map((t) => t.name),
          nada: tipo.damage_relations.no_damage_to.map((t) => t.name),
        });
      }

      // Regra do grupo: Pokémon de um tipo só repete o tipo nos dois espaços
      if (tipos.length === 1) {
        tipos.push(tipos[0]);
        relacoes.push(relacoes[0]);
      }

      setPokemon({
        id: dados.id,
        nome: dados.name,
        imagem: dados.sprites.front_default,
        tipos,
        relacoes,
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  // Busca só os NOMES dos 1025 Pokémon, para sugerir enquanto digita
  async function carregarNomes() {
    try {
      const resposta = await fetch(`${URL_API}?limit=1025`);
      if (!resposta.ok) {
        throw new Error(`Erro ao carregar os nomes (status ${resposta.status})`);
      }
      const dados = await resposta.json();
      setTodosNomes(dados.results.map((p) => p.name));
    } catch (err) {
      // Sem os nomes, só as sugestões não aparecem: o botão Buscar continua
      console.log(err.message);
    }
  }

  // Ao abrir o app, carrega os nomes (uma vez só, por causa do [])
  useEffect(() => {
    carregarNomes();
  }, []);

  // Busca na API a partir do que o usuário digitou
  function buscar(e) {
    e.preventDefault();
    if (texto.trim() === '') return;
    carregar(texto.trim().toLowerCase());
    setTexto(''); // limpa o campo, e com ele as sugestões
  }

  // Clicou numa sugestão: busca aquele Pokémon
  function escolherSugestao(nome) {
    carregar(nome);
    setTexto('');
  }

  function adicionar() {
    aoAlterarTime([...time, pokemon]); // cria um NOVO array (time atual + o novo)
    setPokemon(null);
  }

  function remover(id) {
    aoAlterarTime(time.filter((p) => p.id !== id));
  }

  // Sugestões: os nomes que contêm o que foi digitado (filtra a lista da memória)
  const digitado = texto.trim().toLowerCase();
  const sugestoes =
    digitado === '' ? [] : todosNomes.filter((nome) => nome.includes(digitado)).slice(0, 8);

  const timeCheio = time.length >= 3;
  // Já está no time se o filter achar alguém com o mesmo id
  const jaEstaNoTime = pokemon && time.filter((p) => p.id === pokemon.id).length > 0;

  return (
    <div className="caixa">
      <h2>{titulo} ({time.length}/3)</h2>

      <form onSubmit={buscar}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ex.: pikachu"
        />
        <button type="submit">Buscar</button>
      </form>

      {sugestoes.length > 0 && (
        <div className="sugestoes">
          {sugestoes.map((nome) => (
            <button key={nome} onClick={() => escolherSugestao(nome)}>
              {nome}
            </button>
          ))}
        </div>
      )}

      {carregando && <p>Carregando...</p>}
      {erro && <p className="erro">{erro}</p>}

      {pokemon && (
        <div>
          <p className="sucesso">Pokémon encontrado!</p>
          <Cartao
            nome={pokemon.nome}
            imagem={pokemon.imagem}
            detalhe={`${pokemon.tipos[0]} / ${pokemon.tipos[1]}`}
            textoBotao="Adicionar ao time"
            aoClicar={adicionar}
            desativado={timeCheio || jaEstaNoTime}
          />
        </div>
      )}

      {time.map((p) => (
        <Cartao
          key={p.id}
          nome={p.nome}
          imagem={p.imagem}
          detalhe={`${p.tipos[0]} / ${p.tipos[1]}`}
          textoBotao="Remover"
          aoClicar={() => remover(p.id)}
        />
      ))}
    </div>
  );
}

export default SeletorPokemon;
