export class Cancion {
    id: number;
    titulo: string;
    minutos: number | null;
    segundos: number | null;
    interprete: string;
    usuario: number;
    albumes: Array<any>;
    favorita: number;
    genero: Generos;

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        usuario: number,
        albumes: Array<any>,
        favorita: number
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete,
        this.usuario = usuario,
        this.albumes = albumes,
        this.favorita = favorita
    }
}
export class CancionCompartida {
  id_Cancion: string;
  id_Usuario: Array<any>;

  constructor(
    idCancion: string,
    idUsuario: Array<any>
  ){
    this.id_Cancion = idCancion,
      this.id_Usuario = idUsuario
  }
}

export class AlbumCompartido {
  id_Album: string;
  id_Usuario: Array<any>

  constructor(
    id_Album: string,
    idUsuario: Array<any>
  ){
    this.id_Album = id_Album,
      this.id_Usuario = idUsuario
  }
}

export class Generos{
  llave: string;
  constructor(llave: string){
    this.llave = llave
  }
}

