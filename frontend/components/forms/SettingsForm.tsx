"use client"

import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createOne, updateOne } from "@/lib/postgres/helpers/single"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useState } from "react"
import { Loader } from "lucide-react"

type SettingsFormValues = {
    id?: string
    context: string
    notifications: boolean
}

const DEFAULT_VALUES: SettingsFormValues = {
    context: "",
    notifications: true,
}

export default function SettingsForm({ defaultValues }: { defaultValues?: SettingsFormValues }) {
    const { register, handleSubmit, setValue, watch } = useForm<SettingsFormValues>({
        defaultValues: defaultValues || DEFAULT_VALUES,
    })
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()
    const userId = session?.user?.id

    const onSubmit = async (data: SettingsFormValues) => {
        console.log("Saving settings:", data)
        if (!userId) {
            toast("Must be logged in to edit")
            console.error("User settings update attempt for unauthorized user")
            return
        }
        setLoading(true)
        // You can send to API here

        const fulldata = {
            ...data,
            userid: userId
        }
        console.log(defaultValues)
        const res = (defaultValues && defaultValues.id)
            ? await updateOne("settings", defaultValues.id, fulldata)
            : await createOne("settings", fulldata)
        toast("Successfully saved settings!")
        setLoading(false)
    }

    const notifications = watch("notifications")

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className=" w-full p-6 rounded-2xl border bg-white space-y-6"
        >
            <h2 className="text-xl font-semibold text-green-600">Company RFP Settings</h2>

            {/* Context Textarea */}
            <div className="space-y-2">
                <Label htmlFor="context" className="text-green-700">Company Context</Label>
                <Textarea
                    id="context"
                    {...register("context")}
                    placeholder="Describe what your company does..."
                    className="min-h-[120px] border-green-300 focus:ring-green-500 focus:border-green-500"
                />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-green-700">Email Notifications</Label>
                <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={(val) => setValue("notifications", val)}
                />
            </div>

            {/* Submit Button */}
            <Button
                disabled={loading}
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white w-full rounded-xl"
            >
                {loading ? <Loader className="animate-spin" /> : "Save Settings"}
            </Button>
        </form>
    )
}
