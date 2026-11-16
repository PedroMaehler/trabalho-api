// O mesmo card serve para personagem, líder e Pokémon: o que muda vem pelas props
function Cartao({ nome, imagem, detalhe, destaque, textoBotao, aoClicar, desativado }) {
  return (
    <div className={destaque ? 'cartao cartao-destaque' : 'cartao'}>
      {imagem && <img src={imagem} alt={nome} width="60" height="60" />}
      <div className="info">
        <h3>{nome}</h3>
        <p>{detalhe}</p>
      </div>
      {/* Sem textoBotao (o card do líder já escolhido), o botão não aparece */}
      {textoBotao && (
        <button onClick={aoClicar} disabled={desativado}>
          {textoBotao}
        </button>
      )}
    </div>
  );
}

export default Cartao;
