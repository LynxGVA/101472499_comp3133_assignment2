import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { Auth } from '../../services/auth'
import { GraphqlService } from '../../services/graphql'
import { FullNamePipe } from '../../pipes/full-name'
import { CardHoverDirective } from '../../directives/card-hover'

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, FormsModule, FullNamePipe, CardHoverDirective],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList {
  employees: any[] = []
  searchText = ''
  errorMessage = ''
  loading = false
  deletingId = ''

  constructor(
    private auth: Auth,
    private router: Router,
    private graphql: GraphqlService
  ) {}

  ngOnInit() {
    this.loadEmployees()
  }

  async loadEmployees() {
    this.loading = true
    this.errorMessage = ''

    const query = `
      query GetEmployees($search: String) {
        getEmployees(search: $search) {
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
      const data = await this.graphql.request(query, {
        search: this.searchText.trim() || null
      })
      this.employees = data.getEmployees
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to load employees'
    } finally {
      this.loading = false
    }
  }

  goToAddEmployee() {
    this.router.navigate(['/add-employee'])
  }

  openView(employee: any) {
    localStorage.setItem('selectedEmployee', JSON.stringify(employee))
    this.router.navigate(['/employee', employee.id])
  }

  openEdit(employee: any) {
    localStorage.setItem('selectedEmployee', JSON.stringify(employee))
    this.router.navigate(['/edit-employee', employee.id])
  }

  async deleteEmployee(id: string) {
    if (this.deletingId) return

    const ok = confirm('Delete this employee?')
    if (!ok) return

    this.errorMessage = ''
    this.deletingId = id

    const mutation = `
      mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id)
      }
    `

    try {
      await this.graphql.request(mutation, { id })
      this.employees = this.employees.filter(e => e.id !== id)
    } catch (error: any) {
      this.errorMessage = error.message || 'Delete failed'
    } finally {
      this.deletingId = ''
    }
  }

  logout() {
    this.auth.logout()
    localStorage.removeItem('selectedEmployee')
    this.router.navigate(['/login'])
  }
}