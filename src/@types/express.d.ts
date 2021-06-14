// criando uma tipagem para o request do express
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }

}
