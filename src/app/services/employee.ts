import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employees = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@mail.com', department: 'IT', position: 'Developer' },
    { id: 2, firstName: 'Anna', lastName: 'Smith', email: 'anna@mail.com', department: 'HR', position: 'Manager' }
  ]

  getEmployees() {
    return this.employees
  }

  addEmployee(emp: any) {
    emp.id = Date.now()
    this.employees.push(emp)
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter(e => e.id !== id)
  }

  getEmployeeById(id: number) {
    return this.employees.find(e => e.id == id)
  }

  updateEmployee(updated: any) {
    const index = this.employees.findIndex(e => e.id == updated.id)
    if (index !== -1) {
      this.employees[index] = updated
    }
  }
}