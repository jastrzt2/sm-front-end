import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"


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
import { SignInValidation as SignInValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


export const SignInForm = () => {
  const { toast } = useToast()
  const [ formMessage, setFormMessage] = useState('');  
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })


async function onSubmit(values: z.infer<typeof SignInValidation>) {
  setFormMessage('');

  try {
    const token = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!token) {
      navigate('/sign-in');
      return toast({
        title: "Sign in failed. Please try again.",
        duration: 5000,
      });
    }
    console.log('User signed in successfully');
    localStorage.setItem('cookieFallback', token);
    const isLoggedIn = await checkAuthUser();

    console.log('Is logged in:', isLoggedIn);

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      // This might be redundant if checkAuthUser only fails on server errors
      toast({
        title: "Sign in failed. Please try again.",
        duration: 5000,
      });
      navigate('/sign-in');
    }
  } catch (error) {
    console.error('Error during sign in:', error);

    // Handle authorization errors
    if (error.status === 401) {
      toast({
        title: "Authorization failed. Please check your credentials.",
        duration: 5000,
      });
    } else if (error.status === 403) {
      toast({
        title: "Access denied. You don't have permission to access this.",
        duration: 5000,
      });
    } else if (error.status === 404) {
      toast({
        title: "User not found. Please check your credentials.",
        duration: 5000,
      });
    } else {
      // Handle server errors
      toast({
        title: "An unexpected error occurred. Please try again later.",
        duration: 5000,
      });
    }

    navigate('/sign-in');
  }
}

  
  

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" className="mb-8" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Please, enter your email and password</p>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
          { isSigningIn || isUserLoading ? (
            <div className="flex-center gap-2">
              <Loader/>Loading...
            </div>

          ): "Sign In" }
          </Button>
          {formMessage && (
            <p className="text-center mt-4 text-rose-600">{formMessage}</p>
          )}
          <p className="text-small-red text-light-2 text-center mt-2">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
      </form>
      </div>
    </Form>
  )
}

export default SignInForm