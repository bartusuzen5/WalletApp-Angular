import { NgForm } from "@angular/forms";

export class GenericUtils {
   
  static getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}