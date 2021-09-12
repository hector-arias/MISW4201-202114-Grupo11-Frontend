import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album} from './album';
import {AlbumCompartido, Cancion, CancionCompartida} from '../cancion/cancion';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private backUrl: string = "https://misw4201-equipo-11-backend.herokuapp.com"

  constructor(private http: HttpClient) { }

  getAlbumes(usuario: number, token: string): Observable<Album[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*'
    })
    return this.http.get<Album[]>(`${this.backUrl}/usuario/${usuario}/albumes`, {headers: headers})
  }

  getCancionesAlbum(idAlbum: number, token: string): Observable<Cancion[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*'
    })
    return this.http.get<Cancion[]>(`${this.backUrl}/album/${idAlbum}/canciones`, {headers: headers})
  }

  crearAlbum(idUsuario: number, token: string, album: Album):Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*'
    })
    return this.http.post<Album>(`${this.backUrl}/usuario/${idUsuario}/albumes`, album, {headers: headers})
  }

  getAlbum(albumId: number): Observable<Album>{
    return this.http.get<Album>(`${this.backUrl}/album/${albumId}`)
  }

  editarAlbum(idUsuario: number, token: string, albumId: number, album: Album): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*'
    })
    return this.http.put<Album>(`${this.backUrl}/album/${albumId}`, album, {headers: headers})
  }

  eliminarAlbum(idUsuario: number, token: string, albumId: number): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*'
    })
    return this.http.delete<Album>(`${this.backUrl}/album/${albumId}`, {headers: headers})
  }

  asociarCancion(albumId: number, cancionId: number): Observable<Cancion>{
    return this.http.post<Cancion>(`${this.backUrl}/album/${albumId}/canciones`, {"id_cancion": cancionId})
  }

  compartirAlbum(infoCompartida: AlbumCompartido,idUsuario: number,token: string): Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*'
    })
    return this.http.post<Cancion>(`${this.backUrl}/album/${infoCompartida.id_Album}/compartir`, {"ids_usuarios": infoCompartida.id_Usuario},{headers: headers})
  }

}
