import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { GraphqlService } from '../../services/graphql'
import { CardHoverDirective } from '../../directives/card-hover'

@Component({
  selector: 'app-add-employee',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardHoverDirective],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployee {
  form
  errorMessage = ''
  loading = false
  pictureBase64 = ''

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private graphql: GraphqlService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required]
    })
  }

  onFileChange(event: any) {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'Image must be smaller than 2MB'
      return
    }

    this.errorMessage = ''

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxSize = 300

        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(img, 0, 0, width, height)
        this.pictureBase64 = canvas.toDataURL('image/jpeg', 0.7)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  async onSubmit() {
    this.errorMessage = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.loading = true

    const mutation = `
      mutation AddEmployee($input: AddEmployeeInput!) {
        addEmployee(input: $input) {
          id
        }
      }
    `

    try {
      await this.graphql.request(mutation, {
        input: {
          ...this.form.value,
          picture: this.pictureBase64
        }
      })
      this.router.navigate(['/employees'])
    } catch (error: any) {
      this.errorMessage = error.message || 'Add employee failed'
    } finally {
      this.loading = false
    }
  }
}