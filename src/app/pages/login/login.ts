import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Auth } from '../../services/auth'
import { GraphqlService } from '../../services/graphql'
import { CardHoverDirective } from '../../directives/card-hover'

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardHoverDirective],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm
  errorMessage = ''
  loading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private graphql: GraphqlService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  async onSubmit() {
    this.errorMessage = ''

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    this.loading = true

    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    `

    try {
      const data = await this.graphql.request(mutation, this.loginForm.value)
      this.auth.setToken(data.login.token)
      this.router.navigate(['/employees'])
    } catch (error: any) {
      this.errorMessage = error.message || 'Login failed'
    } finally {
      this.loading = false
    }
  }
}