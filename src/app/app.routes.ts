import { Routes } from '@angular/router'
import { Login } from './pages/login/login'
import { Signup } from './pages/signup/signup'
import { EmployeeList } from './pages/employee-list/employee-list'
import { AddEmployee } from './pages/add-employee/add-employee'
import { EmployeeDetails } from './pages/employee-details/employee-details'
import { EditEmployee } from './pages/edit-employee/edit-employee'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'employees', component: EmployeeList },
  { path: 'add-employee', component: AddEmployee },
  { path: 'employee/:id', component: EmployeeDetails },
  { path: 'edit-employee/:id', component: EditEmployee }
]