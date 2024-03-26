import { BadRequestException } from "../../common/exceptions";

export const confirmPasswordValidator = (body: any) => {
  if (body.password !== body.confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }
};
