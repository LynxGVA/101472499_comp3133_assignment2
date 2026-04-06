import { Injectable } from '@angular/core'
import axios from 'axios'
import { Auth } from './auth'

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  apiUrl = 'https://one01472499-comp3133-assignment2.onrender.com/graphql'

  constructor(private auth: Auth) {}

  async request(query: string, variables: any = {}) {
    const token = this.auth.getToken()

    const response = await axios.post(
      this.apiUrl,
      {
        query,
        variables
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {})
        }
      }
    )

    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data
  }
}