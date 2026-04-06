import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {
  transform(employee: any): string {
    if (!employee) return ''
    return `${employee.firstName} ${employee.lastName}`
  }
}