import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Auth } from '../../services/auth'
import { GraphqlService } from '../../services/graphql'
import { CardHoverDirective } from '../../directives/card-hover'

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardHoverDirective],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupForm
  errorMessage = ''
  loading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private graphql: GraphqlService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  async onSubmit() {
    this.errorMessage = ''

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched()
      return
    }

    this.loading = true

    const mutation = `
      mutation Signup($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
        signup(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
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
      const data = await this.graphql.request(mutation, this.signupForm.value)
      this.auth.setToken(data.signup.token)
      this.router.navigate(['/employees'])
    } catch (error: any) {
      this.errorMessage = error.message || 'Signup failed'
    } finally {
      this.loading = false
    }
  }
}