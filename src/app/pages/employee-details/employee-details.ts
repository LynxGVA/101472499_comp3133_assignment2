import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { GraphqlService } from '../../services/graphql'
import { FullNamePipe } from '../../pipes/full-name'
import { CardHoverDirective } from '../../directives/card-hover'

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule, RouterLink, FullNamePipe, CardHoverDirective],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails {
  employee: any = null
  errorMessage = ''
  loading = false

  constructor(
    private route: ActivatedRoute,
    private graphql: GraphqlService
  ) {}

  ngOnInit() {
    const savedEmployee = localStorage.getItem('selectedEmployee')

    if (savedEmployee) {
      const parsed = JSON.parse(savedEmployee)
      const routeId = this.route.snapshot.paramMap.get('id')

      if (parsed.id === routeId) {
        this.employee = parsed
        return
      }
    }

    this.loadEmployee()
  }

  async loadEmployee() {
    this.loading = true
    this.errorMessage = ''

    const id = this.route.snapshot.paramMap.get('id')

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
      const data = await this.graphql.request(query, { id })
      this.employee = data.getEmployee
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to load employee'
    } finally {
      this.loading = false
    }
  }
}