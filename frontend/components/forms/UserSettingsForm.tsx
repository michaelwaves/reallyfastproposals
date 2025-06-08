"use client"

import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"

type UserSettingsFormValues = {
    name: string
    email: string
}

const DEFAULT_VALUES: UserSettingsFormValues = {
    name: "",
    email: "",
}

export default function UserSettingsForm({ defaultValues }: { defaultValues?: UserSettingsFormValues }) {
    const { register, handleSubmit, setValue, watch } = useForm<UserSettingsFormValues>({
        defaultValues: defaultValues || DEFAULT_VALUES,
    })

    const onSubmit = (data: UserSettingsFormValues) => {
        console.log("Saving settings:", data)
        // You can send to API here
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className=" w-full p-6 rounded-2xl border bg-white space-y-6"
        >
            <h2 className="text-xl font-semibold text-green-600">User Settings</h2>

            <div className="space-y-2">
                <Label htmlFor="name" className="text-green-700">Name</Label>
                <Input
                    id="name"
                    {...register("name")}
                    placeholder="Name"
                    className=" border-green-300 focus:ring-green-500 focus:border-green-500"
                />
            </div >
            <div className="space-y-2 ">
                <Label htmlFor="email" className="text-green-700">Email</Label>
                <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className=" border-green-300 focus:ring-green-500 focus:border-green-500"
                />
            </div>

            <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white w-full rounded-xl"
            >
                Save User Settings
            </Button>
        </form >
    )
}
