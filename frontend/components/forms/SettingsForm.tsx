"use client"

import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type SettingsFormValues = {
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

    const onSubmit = (data: SettingsFormValues) => {
        console.log("Saving settings:", data)
        // You can send to API here
    }

    const notifications = watch("notifications")

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl w-full p-6 rounded-2xl border bg-white space-y-6"
        >
            <h2 className="text-xl font-semibold text-green-600">Company RFP Settings</h2>

            {/* Context Textarea */}
            <div className="space-y-2">
                <Label htmlFor="context" className="text-green-700">Company Context</Label>
                <Textarea
                    id="context"
                    {...register("context")}
                    placeholder="Describe what your company does..."
                    className="min-h-[120px] border-lime-300 focus:ring-green-500 focus:border-green-500"
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
                type="submit"
                className="bg-lime-600 hover:bg-lime-700 text-white w-full rounded-xl"
            >
                Save Settings
            </Button>
        </form>
    )
}
