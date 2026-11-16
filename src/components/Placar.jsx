function Placar({ nomeRick, nomeStar, pontosRick, pontosStar }) {
  let vencedor = 'Empate!';
  if (pontosRick > pontosStar) vencedor = `Vencedor: time de ${nomeRick}`;
  if (pontosStar > pontosRick) vencedor = `Vencedor: time de ${nomeStar}`;

  return (
    <div className="caixa placar">
      <h2>
        {nomeRick}: {pontosRick} pontos × {nomeStar}: {pontosStar} pontos
      </h2>
      <h2>{vencedor}</h2>
    </div>
  );
}

export default Placar;
