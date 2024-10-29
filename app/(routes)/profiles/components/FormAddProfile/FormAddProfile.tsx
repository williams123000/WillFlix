"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FormAddProfileProps } from "./FormAddProfile.types";
import { formSchema } from "./FormAddProfile.forms";
import { dataProfilesImages } from "./FormAddProfile.data";
import Image from "next/image";

export function FromAddProfile(props: FormAddProfileProps) {
  const { setOpen } = props;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileName: "",
      avatarUrl: undefined,
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="profileName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de perfil</FormLabel>
              <FormControl>
                <Input placeholder="Williams" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Selecciona tu imagen de perfil</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-y-1"
                >
                  {dataProfilesImages.map((data) => (
                    <FormItem
                      key={data.urlImage}
                      className="flex flex-col-reverse justify-center items-center space-x-5 space-y-0 cursor-pointer"
                    >
                      <FormControl className="text-white ml-3 mt-1">
                        <RadioGroupItem value={data.urlImage}></RadioGroupItem>
                      </FormControl>
                      <FormLabel className="font-normal flex justify-center w-full">
                        <Image src={data.urlImage} alt="Profile" width={50} height={50} 
                        className={field.value === data.urlImage ? "cursor-pointer border-white" : ""
                        }/>
                        </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
