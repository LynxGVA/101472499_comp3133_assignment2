import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class Auth {
  setToken(token: string) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isLoggedIn() {
    return !!localStorage.getItem('token')
  }

  logout() {
    localStorage.removeItem('token')
  }
}