function CartaoAluno({ nome, curso, semestre = 3, foto, destaque }) {
  return (
    <div className={destaque ? 'cartao cartao-destaque' : 'cartao'}>
      <img src={foto} alt={'Foto de ${nome}'} />
      <h3>{home}</h3>
      <p>
        {curso} - {semestre}º semestre
      </p>
      {destaque && <span className="selo"> ⭐ Destaque</span>}
    </div>
  );
}
