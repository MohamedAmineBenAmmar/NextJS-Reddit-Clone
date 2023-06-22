"use client";

import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface UserNameFormProps {
  user: Pick<User, "id" | "username">;
}

export const UserNameForm = ({ user }: UserNameFormProps) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator), // This will make the send of the form fail if the client side validation fails
    defaultValues: {
      name: user?.username || "",
    },
  });

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = {
        name
      }

      const { data } = await axios.patch('/api/username', payload);
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Username already taken.',
            description: 'Please choose another username.',
            variant: 'destructive',
          })
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: 'Your username was not updated. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: 'Your username has been updated.',
      })
      router.refresh()
    },
  })

  return (
    <form onSubmit={handleSubmit((e) => {
      updateUser(e)
    })}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>Pleas enter a display username.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};
