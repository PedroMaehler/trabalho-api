import './App.css';
import Cabecalho from './components/Cabecalho';
import Rodape from './components/Rodape';

function App() {
  const nome = ' Turma Frameworks';
  const ano = 2026;
  const logado = true;
  const estiloDestaque = { color: 'tomato', fontSize: '24px' };

  return (
    <>
      <Cabecalho />
      <main>
        <h2>Olá, {nome}</h2>
        <p>
          Estamos em {ano}. Ano que vem será {ano + 1}.
        </p>
        <p>Nome em maiúsculas: {nome.toUpperCase()}</p>

        <p className="aviso">Usamos className, e não class</p>
        <p style={estiloDestaque}>Estilo inline é um PROJETO</p>

        <img src="https://picsum.photos/200" alt="Foto aleatória" />

        {/*Isto é um comentário em JSX*/}

        {logado ? <p>Bem-vindo de volta!</p> : <p>Por favaor, faça login.</p>}
        {logado && <button>Sair</button>}
      </main>
      <Rodape />
    </>
  );
}

export default App;
