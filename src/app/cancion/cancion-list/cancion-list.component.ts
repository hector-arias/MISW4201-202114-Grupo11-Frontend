import { Component, OnInit } from '@angular/core';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cancion-list',
  templateUrl: './cancion-list.component.html',
  styleUrls: ['./cancion-list.component.css']
})
export class CancionListComponent implements OnInit {

  constructor(
    private cancionService: CancionService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  userId: number
  token: string
  canciones: Array<Cancion>
  mostrarCanciones: Array<Cancion>
  cancionSeleccionada: Cancion
  cancionFinal: any[] = [];
  indiceSeleccionado: number = 0

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getCanciones();
    }
  }

  getCanciones():void{
    this.cancionService.getCanciones(this.userId)
    .subscribe(canciones => {
      this.canciones = canciones
      this.canciones=this.canciones.sort((a, b) => (a.favorita < b.favorita) ? 1 : -1)
      this.mostrarCanciones = canciones
      this.onSelect(this.mostrarCanciones[0], 0)
    })
  }

  onSelect(cancion: Cancion, indice: number){
    this.indiceSeleccionado = indice
    this.cancionSeleccionada = cancion
    this.cancionService.getAlbumesCancion(cancion.id)
    .subscribe(albumes => {
      this.cancionSeleccionada.albumes = albumes
    },
    error => {
      this.showError(`Ha ocurrido un error: ${error.message}`)
    })

  }

  buscarCancion(busqueda: string){
    let cancionesBusqueda: Array<Cancion> = []
    let cancionesBusquedaFinal: Array<Cancion> = []
    let buscar: any;
    this.cancionFinal = []
    this.canciones.map( cancion => {

      if(cancion.titulo.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
      || cancion.interprete.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
      || cancion.genero?.llave.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())){

        cancionesBusqueda.push(cancion);
        cancionesBusqueda.forEach(element => {

          buscar = this.cancionFinal.find(
            (x) => x.titulo == element.titulo
          );
          
          if(buscar == undefined){
            this.cancionFinal.push(cancion)
          }
        });

      }
    })

    this.mostrarCanciones = [];
    if(this.cancionFinal.length == 0){
      this.cancionFinal.push({
        "id": 1,
        "titulo": "No existen resultados",
        "minutos": null,
        "segundos": null,
        "interprete": "",
        "usuario": 2,
        "albumes": [],
        "favorita": 0,
        "genero": {"llave": "2"}
      })
    }
    this.mostrarCanciones = this.cancionFinal
  }

  eliminarCancion(){
    this.cancionService.eliminarCancion(this.cancionSeleccionada.id)
    .subscribe(cancion => {
      this.ngOnInit()
      this.showSuccess()
    },
    error=> {
      this.showError("Ha ocurrido un error. " + error.message)
    })
  }

  irCrearCancion(){
    this.routerPath.navigate([`/canciones/create/${this.userId}/${this.token}`])
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La canción fue eliminada`, "Eliminada exitosamente");
  }

  cancionFavorita(){
    console.log(this.cancionSeleccionada)
    var newCancion= this.cancionSeleccionada

    if(newCancion.favorita == 0){
      newCancion.favorita = 1
    }else{
      newCancion.favorita = 0
    }

    this.cancionService.cancionFavorita(newCancion.id,newCancion.favorita,this.token)
    .subscribe(cancion => {
      this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
        this.getCanciones()
    },
    error=> {
      if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })

  }


}
