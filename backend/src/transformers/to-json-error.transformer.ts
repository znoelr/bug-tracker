export const toJsonError = (errors: any) => {
  if (typeof errors === 'string') {
    return { errors: { message: errors } }
  }
  return { errors };
};
