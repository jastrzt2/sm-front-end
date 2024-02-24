import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useForm } from "react-hook-form"
import { SingUpValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useState } from "react"


export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  // Move the initialization of the 'form' variable inside the body of the 'SignUpForm' function.
  const form = useForm<z.infer<typeof SingUpValidation>>({
    resolver: zodResolver(SingUpValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof SingUpValidation>) {
    setIsLoading(true);
    setUsernameError(''); // Clear previous username error messages
    setEmailError(''); // Clear previous email error messages
    setErrorMessage(''); // Clear any previous general error messages
  
    try {
      const response = await fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User created successfully', data);
        // Navigate to login page or dashboard, e.g., using react-router-dom's useHistory hook
      } else {
        const data = await response.json();
        if (data.errors) {
          data.errors.forEach((error) => {
            if (error.field === 'username') {
              setUsernameError(error.message);
            } else if (error.field === 'email') {
              setEmailError(error.message);
            }
          });
        } else {
          setErrorMessage(data.message || 'Failed to create user');
        }
      }
    } catch (error) {
      console.error('An error occurred while creating the user', error);
      setErrorMessage(error.toString());
    } finally {
      setIsLoading(false);
    }
  }
  
  

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" className="mb-8" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Enter your details</p>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
          {isLoading ? (
            <div className="flex-center gap-2">
              <Loader/>Loading...
            </div>

          ): "Sign Up" }
          </Button>
          <p className="text-small-red text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
              Sign In
            </Link>
          </p>
          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
      </form>
      </div>
    </Form>
  )
}

export default SignUpForm