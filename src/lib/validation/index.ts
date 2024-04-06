import { z } from "zod"


export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Name is too short" }).max(100, { message: "Name can't have more than 100 characters" }),
  username: z.string().min(2, { message: "Name is too short" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 letter" }),
})

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 letter" }),
})

export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Caption can't have less than 5 characters" }).max(2000, { message: "Caption can't have more than 2000 characters" }),
  file: z.custom<File[]>(),
  location: z.string().max(100, { message: "Location is too long" }).optional(),
  tags: z.string().optional(),
})

export const UserValidation = z.object({
  name: z.string().min(2, { message: "Username can't have less than 2 characters" }).max(100, { message: "Name can't have more than 100 characters" }),
  file: z.custom<File[]>(),
  bio: z.string().max(500, { message: "Bio is too long" }).optional(),
  city: z.string().optional(),
})