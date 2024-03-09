import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"


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
import { SignUpValidation as SignUpValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useState } from "react"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


export const SignUpForm = () => {
  const { toast } = useToast()
  const [ formMessage, setFormMessage] = useState('');  
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })


async function onSubmit(values: z.infer<typeof SignUpValidation>) {
  setFormMessage('');

  const { success, data } = await createUserAccount(values);

  if (success) {
    console.log('User created successfully', data);
  } else {
    console.error('Failed to create user', data.message);
    setFormMessage(data.message || 'Failed to create user.');
    toast({
      title: "Sign up failed. Please try again.",
    })
    return;
  }
  
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

  const isLoggedIn = await checkAuthUser(token);

  console.log('Is logged in:', isLoggedIn);

  if(isLoggedIn) {
    form.reset();
    navigate('/');
  } else {
    toast({
      title: "Sign in failed. Please try again.",
      duration: 5000,
    });
    navigate('/sign-in');
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
          {isCreatingUser || isSigningIn || isUserLoading ? (
            <div className="flex-center gap-2">
              <Loader/>Loading...
            </div>

          ): "Sign Up" }
          </Button>
          {formMessage && (
            <p className="text-center mt-4 text-rose-600">{formMessage}</p>
          )}
          <p className="text-small-red text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
              Sign in
            </Link>
          </p>
      </form>
      </div>
    </Form>
  )
}

export default SignUpForm