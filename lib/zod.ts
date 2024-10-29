import {object, string} from 'zod';

export const signInSchema = object({
    email: string({required_error: "email is required"})
    .min(2,"Emial is required")
    .email("Invalid email"),
    password: string({required_error: "password is required"})
    .min(1,"Password is required")

});