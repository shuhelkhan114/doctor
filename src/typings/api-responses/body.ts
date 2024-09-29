export interface PatientSignUpBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  linked_my_chart: boolean;
  date_of_birth: string;
}
