// src/utils/formErrors.ts
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";

export function handleServerErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>
): string | null {
  const serverResponse = error?.response?.data;

  // 1. Обробка помилок полів (errorsValidation)
  if (serverResponse?.errorsValidation && Array.isArray(serverResponse.errorsValidation)) {
    let hasFieldErrors = false;

    serverResponse.errorsValidation.forEach((errorObject: any) => {
      Object.entries(errorObject).forEach(([field, message]) => {
        // Встановлюємо помилку конкретному полю
        setError(field as Path<T>, { 
          type: "server", 
          message: String(message) 
        });
        hasFieldErrors = true;
      });
    });

    // Якщо знайшли помилки полів, повертаємо null (загальна помилка не треба)
    if (hasFieldErrors) return null;
  }

  // 2. Обробка загальної помилки (якщо це не поля)
  if (typeof serverResponse === "string") return serverResponse;
  return serverResponse?.message || serverResponse?.errorMessage || "Сталася невідома помилка";
}