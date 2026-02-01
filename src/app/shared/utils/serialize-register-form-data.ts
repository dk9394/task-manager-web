import { RegisterRequest } from '../../models/auth/auth.model';
import { RegisterFormValues } from '../../models/auth/register-form.model';

export function SerializeRegisterFormData(
  formRawData: RegisterFormValues,
): RegisterRequest {
  return {
    name: formRawData.name,
    email: formRawData.email,
    password: formRawData.password,
  };
}
