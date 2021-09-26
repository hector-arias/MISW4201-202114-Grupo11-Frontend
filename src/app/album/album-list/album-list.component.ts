import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Album, AlbumInterpretes, Cancion } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css'],
})
export class AlbumListComponent implements OnInit {
  constructor(
    private albumService: AlbumService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) {}

  userId: number;
  token: string;
  albumes: Array<Album>;
  mostrarAlbumes: Array<Album>;
  albumSeleccionado: Album;
  albumFinal: any[] = [];
  interpretesMiColeccion: Array<AlbumInterpretes>;
  indiceSeleccionado: number;

  ngOnInit() {
    if (
      !parseInt(this.router.snapshot.params.userId) ||
      this.router.snapshot.params.userToken === ' '
    ) {
      this.showError(
        'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
      );
    } else {
      this.userId = parseInt(this.router.snapshot.params.userId);
      this.token = this.router.snapshot.params.userToken;
      this.getAlbumes();
    }
  }

  getAlbumes(): void {
    this.albumService.getAlbumes(this.userId, this.token).subscribe(
      (albumes) => {
        this.albumes = albumes;
        this.mostrarAlbumes = albumes;
        if (albumes.length > 0) {
          this.onSelect(this.mostrarAlbumes[0], 0);
          this.cargarInterpretes(this.albumes);
        }
      },
      (error) => {
        console.log(error);
        if (error.statusText === 'UNAUTHORIZED') {
          this.showWarning(
            'Su sesión ha caducado, por favor vuelva a iniciar sesión.'
          );
        } else if (error.statusText === 'UNPROCESSABLE ENTITY') {
          this.showError(
            'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
          );
        } else {
          this.showError('Ha ocurrido un error. ' + error.message);
        }
      }
    );
  }

  onSelect(album: Album, index: number) {
    this.indiceSeleccionado = index;
    this.albumSeleccionado = album;
    this.albumService.getCancionesAlbum(album.id, this.token).subscribe(
      (canciones) => {
        this.albumSeleccionado.canciones = canciones;
        this.albumSeleccionado.interpretes = this.getInterpretes(canciones);
      },
      (error) => {
        this.showError('Ha ocurrido un error, ' + error.message);
      }
    );
  }

  getInterpretes(canciones: Array<Cancion>): Array<string> {
    var interpretes: Array<string> = [];
    canciones.forEach((cancion) => {
      if (!interpretes.includes(cancion.interprete)) {
        interpretes.push(cancion.interprete);
      }
    });
    return interpretes;
  }

  buscarAlbum(busqueda: string) {
    let albumesBusqueda: Array<Album> = [];
    let buscar: any;
    this.albumFinal = [];
    this.albumes.forEach((album) => {
      if (this.filtrar(album, busqueda)) {
        albumesBusqueda.push(album);
        albumesBusqueda.forEach((albumElement) => {
          buscar = this.albumFinal.find(
            (valorIngresado) => valorIngresado.titulo == albumElement.titulo
          );

          if (buscar == undefined) {
            this.albumFinal.push(album);
          }
        });
      }
    });
    this.mostrarAlbumes = [];
    if (this.albumFinal.length == 0) {
      this.albumFinal.push({
        id: 1,
        titulo: 'No existen resultados',
        anio: null,
        descripcion: '',
        medio: { llave: '1', valor: 1 },
        usuario: 2,
        interpretes: [],
        canciones: [],
        genero: { llave: '1' },
      });
    }
    this.mostrarAlbumes = this.albumFinal;
  }

  private filtrar(album: Album, busqueda: string) {
    return (
      album.titulo.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase()) ||
      album.genero?.llave
        .toLocaleLowerCase()
        .includes(busqueda.toLocaleLowerCase()) ||
      this.albumContieneInterprete(album, busqueda.toLocaleLowerCase())
    );
  }

  irCrearAlbum() {
    this.routerPath.navigate([`/albumes/create/${this.userId}/${this.token}`]);
  }

  eliminarAlbum() {
    this.albumService
      .eliminarAlbum(this.userId, this.token, this.albumSeleccionado.id)
      .subscribe(
        (album) => {
          this.ngOnInit();
          this.showSuccess();
        },
        (error) => {
          if (error.statusText === 'UNAUTHORIZED') {
            this.showWarning(
              'Su sesión ha caducado, por favor vuelva a iniciar sesión.'
            );
          } else if (error.statusText === 'UNPROCESSABLE ENTITY') {
            this.showError(
              'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
            );
          } else {
            this.showError('Ha ocurrido un error. ' + error.message);
          }
        }
      );
    this.ngOnInit();
  }

  showError(error: string) {
    this.toastr.error(error, 'Error de autenticación');
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, 'Error de autenticación');
  }

  showSuccess() {
    this.toastr.success(`El album fue eliminado`, 'Eliminado exitosamente');
  }

  cargarInterpretes(albumes: Array<Album>) {
    this.interpretesMiColeccion = [];
    albumes.forEach((album, indice) => {
      var albumInterpretes = new AlbumInterpretes(album.id);
      this.albumService.getCancionesAlbum(album.id, this.token).subscribe(
        (canciones) => {
          albumInterpretes.interpretes = this.getInterpretes(canciones);
          albumInterpretes.interpretes = albumInterpretes.interpretes.map(
            (interprete) => interprete.toLocaleLowerCase()
          );
          this.interpretesMiColeccion.push(albumInterpretes);
        },
        (error) => {
          this.showError(
            'Ha ocurrido un error cargando las canciones de los álbumes del usuario, ' +
              error.message
          );
        }
      );
    });
    console.log(this.interpretesMiColeccion);
  }

  albumContieneInterprete(album: Album, busqueda: string): boolean {
    var match = false;
    for (let albumInterprete of this.interpretesMiColeccion) {
      if (
        albumInterprete.id == album.id &&
        albumInterprete.interpretes.find((element) =>
          element.includes(busqueda)
        ) != undefined
      ) {
        match = true;
        break;
      }
    }
    return match;
  }
}
