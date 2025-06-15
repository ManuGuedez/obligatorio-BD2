import classes from './EsperandoVoto.module.css';

function EsperandoVoto({ persona, onConfirmVoto, onConfirmObservado }) {
  return (
    <div className={classes.modal}>
      <div className={classes.modalBox}>
        <h2>Esperando votación</h2>
        <p>{persona.nombre} está votando…</p>
        <p>Una vez que termine, seleccione el tipo de voto correspondiente.</p>

        <button className={classes.confirmarBtn} onClick={onConfirmVoto}>
          Confirmar que votó
        </button>

        <button className={classes.cancelarBtn} onClick={onConfirmObservado}>
          Voto observado
        </button>
      </div>
    </div>
  );
}

export default EsperandoVoto;
