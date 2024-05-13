import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FileUploader from "@/components/shared/FileUploader";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast"
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { UserValidation } from "@/lib/validation";

const UserForm = () => {
  const { user } = useUserContext();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  console.log("User:", user);
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      city: user?.city || "",
    },
  });

  async function onSubmit(values: z.infer<typeof UserValidation>) {
    try {
      const updatedUserData = {
        id: user?.id || "",
        ...values,
      };

      console.log("Updated User Data:", updatedUserData.file);

      const response = await updateUser(updatedUserData);
      if (response.success) {
        toast({
          title: "Profile updated successfully",
          color: "success",
        });
        navigate(`/profile/${user?.id}`);
      } else {
        toast({
          title: "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      toast({
        title: "Error updating profile",
      });
    }

  };

  return (
    <div className="flex flex-1 justify-center">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={user?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-center mt-3">
          <Button type="button" className="shad-button_dark_4" disabled={isUpdatingUser} onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isUpdatingUser}>
            {isUpdatingUser ? <Loader /> : 'Update Profile'}
          </Button>
        </div>
      </form>
    </Form>
    </div>
  );
};

export default UserForm;
