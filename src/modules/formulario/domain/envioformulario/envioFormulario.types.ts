interface IEnvioFormulario {
    id: number;
    formularioId: number;
    clienteId: number;
    canal: 'whatsapp' | 'email';
    statusEnvio: 'pendente' | 'enviado' | 'respondido';
    dataEnvio: Date;
}

export {IEnvioFormulario}