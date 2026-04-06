import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { GraphqlService } from '../../services/graphql'
import { CardHoverDirective } from '../../directives/card-hover'

@Component({
  selector: 'app-edit-employee',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardHoverDirective],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.css'
})
export class EditEmployee {
  form
  id = ''
  errorMessage = ''
  loading = false
  pictureBase64 = ''

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  ngOnInit() {
    const savedEmployee = localStorage.getItem('selectedEmployee')

    if (savedEmployee) {
      const parsed = JSON.parse(savedEmployee)
      const routeId = this.route.snapshot.paramMap.get('id')

      if (parsed.id === routeId) {
        this.id = parsed.id
        this.pictureBase64 = parsed.picture || ''

        this.form.patchValue({
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          email: parsed.email,
          department: parsed.department,
          position: parsed.position
        })

        return
      }
    }

    this.loadEmployee()
  }

  async loadEmployee() {
    this.id = this.route.snapshot.paramMap.get('id') || ''

    const query = `
      query GetEmployee($id: ID!) {
        getEmployee(id: $id) {
          id
          firstName
          lastName
          email
          department
          position
          picture
        }
      }
    `

    try {
      const data = await this.graphql.request(query, { id: this.id })
      const employee = data.getEmployee

      this.pictureBase64 = employee.picture || ''

      this.form.patchValue({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        position: employee.position
      })
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to load employee'
    }
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
      mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
        updateEmployee(id: $id, input: $input) {
          id
        }
      }
    `

    try {
      await this.graphql.request(mutation, {
        id: this.id,
        input: {
          ...this.form.value,
          picture: this.pictureBase64
        }
      })
      localStorage.removeItem('selectedEmployee')
      this.router.navigate(['/employees'])
    } catch (error: any) {
      this.errorMessage = error.message || 'Update failed'
    } finally {
      this.loading = false
    }
  }
}