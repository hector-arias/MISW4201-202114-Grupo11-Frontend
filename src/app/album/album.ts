export class Album {
  id: number;
  titulo: string;
  anio: number | null;
  descripcion: string;
  medio: Medio;
  usuario: number;
  interpretes: Array<string>;
  canciones: Array<Cancion>;
  genero: Genero;

  constructor(
    id: number,
    titulo: string,
    anio: number,
    descripcion: string,
    medio: Medio,
    usuario: number,
    interpretes: Array<string>,
    canciones: Array<Cancion>,
    genero: Genero
  ) {
    (this.id = id),
      (this.titulo = titulo),
      (this.anio = anio),
      (this.descripcion = descripcion),
      (this.medio = medio),
      (this.usuario = usuario),
      (this.interpretes = interpretes),
      (this.canciones = canciones),
      (this.genero = genero);
  }
}

export class Medio {
  llave: string;
  valor: number;

  constructor(llave: string, valor: number) {
    (this.llave = llave), (this.valor = valor);
  }
}

export class Cancion {
  id: number;
  titulo: string;
  minutos: number | null;
  segundos: number | null;
  interprete: string;

  constructor(
    id: number,
    titulo: string,
    minutos: number,
    segundos: number,
    interprete: string
  ) {
    (this.id = id),
      (this.titulo = titulo),
      (this.minutos = minutos),
      (this.segundos = segundos),
      (this.interprete = interprete);
  }
}

export class Genero {
  llave: string;
  constructor(llave: string) {
    this.llave = llave;
  }
}

export class AlbumInterpretes {
  id: number;
  interpretes: Array<string>;
  constructor(
    id: number) {
    this.id = id;
  }
}
