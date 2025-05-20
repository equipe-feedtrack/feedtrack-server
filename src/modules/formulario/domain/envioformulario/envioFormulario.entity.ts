// import { IEnvioFormulario } from "./envioFormulario.types";

// class EnvioFormulario implements IEnvioFormulario {
//   private _id: number;
//   private _formularioId: number; // Pegar do fromulário
//   private _clienteId: number; // Pegar do Cliente
//   private _canal: 'whatsapp' | 'email';
//   private _statusEnvio: 'pendente' | 'enviado' | 'respondido';
//   private _dataEnvio: Date;

  
//   get id(): number {
//     return this._id;
//   }

//   get formularioId(): number {
//     return this._formularioId;
//   }

//   set formularioId(value: number) {
//     if (value === undefined || value === null) {
//       throw new Error('O ID do formulário não pode ser nulo ou indefinido.');
//     }
//     this._formularioId = value;
//   }

//   get clienteId(): number {
//     return this._clienteId;
//   }

//   set clienteId(value: number) {
//     if (value === undefined || value === null) {
//       throw new Error('O ID do cliente não pode ser nulo ou indefinido.');
//     }
//     this._clienteId = value;
//   }

//   get canal(): 'whatsapp' | 'email' {
//     return this._canal;
//   }

//   set canal(value: 'whatsapp' | 'email') {
//     if (!['whatsapp', 'email'].includes(value)) {
//       throw new Error("O canal de envio deve ser 'whatsapp' ou 'email'.");
//     }
//     this._canal = value;
//   }

//   get statusEnvio(): 'pendente' | 'enviado' | 'respondido' {
//     return this._statusEnvio;
//   }
  
//   set statusEnvio(value: 'pendente' | 'enviado' | 'respondido') {
//     if (!['pendente', 'enviado', 'respondido'].includes(value)) {
//       throw new Error("O status de envio deve ser 'pendente', 'enviado' ou 'respondido'.");
//     }
//     this._statusEnvio = value;
//   }

//   get dataEnvio(): Date {
//     return this._dataEnvio;
//   }
//   // Não faz sentido ter um setter para data de envio, geralmente é definida na criação

//   constructor(EnvioFormulario: IEnvioFormulario {
//     formularioId: number;
//     clienteId: number;
//     canal: 'whatsapp' | 'email';
//     statusEnvio?: 'pendente' | 'enviado' | 'respondido';
//     dataEnvio?: Date;
//     id?: number;
//   }) {
//     this._id = data.id ?? Date.now(); // Simulação de ID
//     this._formularioId = data.formularioId;
//     this._clienteId = data.clienteId;
//     this._canal = data.canal;
//     this._statusEnvio = data.statusEnvio ?? 'pendente';
//     this._dataEnvio = data.dataEnvio ?? new Date();
//     this.validar();
//   }


//   private validar(): void {
//     if (!['whatsapp', 'email'].includes(this._canal)) {
//       throw new Error("O canal de envio deve ser 'whatsapp' ou 'email'.");
//     }
//     if (!['pendente', 'enviado', 'respondido'].includes(this._statusEnvio)) {
//       throw new Error("O status de envio deve ser 'pendente', 'enviado' ou 'respondido'.");
//     }
//   }
// }

// // export {EnvioFormulario}