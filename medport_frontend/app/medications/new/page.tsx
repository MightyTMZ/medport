"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, ArrowLeft } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import Link from "next/link";

const timeIntervals = ["hours", "days", "weeks", "months"] as const;
const daysOfWeek = [
  { label: "Sun", value: "0" },
  { label: "Mon", value: "1" },
  { label: "Tue", value: "2" },
  { label: "Wed", value: "3" },
  { label: "Thu", value: "4" },
  { label: "Fri", value: "5" },
  { label: "Sat", value: "6" },
];

const schema = z.object({
  name: z.string().min(1, "Medication name is required"),
  color: z.object({
    name: z.string().min(1, "Color name is required"),
    hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
    red: z.number().min(0).max(255),
    green: z.number().min(0).max(255),
    blue: z.number().min(0).max(255),
  }),
  frequency: z.number().positive("Frequency must be positive"),
  frequencyInterval: z.enum(timeIntervals),
  reminders: z.array(
    z.object({
      time: z
        .string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
      repeatInterval: z.enum(timeIntervals),
      repeatDays: z.array(z.string()),
      specificDate: z.date().optional(),
      active: z.boolean(),
      snoozeDuration: z.number().min(1, "Snooze duration must be positive"),
    })
  ),
});

type FormData = z.infer<typeof schema>;

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export default function NewMedication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [frequency, setFrequency] = useState("1");
  const [interval, setInterval] = useState("day");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      color: {
        name: "",
        hex: "#808080",
        red: 128,
        green: 128,
        blue: 128,
      },
      frequency: 1,
      frequencyInterval: "days",
      reminders: [
        {
          time: "09:00",
          repeatInterval: "days",
          repeatDays: [],
          active: true,
          snoozeDuration: 5,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "reminders",
  });

  const updateColorValues = (
    type: "hex" | "rgb",
    value: string | { r: number; g: number; b: number }
  ) => {
    if (type === "hex") {
      const hex = value as string;
      const rgb = hexToRgb(hex);
      form.setValue("color.hex", hex);
      form.setValue("color.red", rgb.r);
      form.setValue("color.green", rgb.g);
      form.setValue("color.blue", rgb.b);
    } else {
      const rgb = value as { r: number; g: number; b: number };
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      form.setValue("color.hex", hex);
      form.setValue("color.red", rgb.r);
      form.setValue("color.green", rgb.g);
      form.setValue("color.blue", rgb.b);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create medication");

      toast.success("Medication created successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to create medication. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Medication
          </h1>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="mt-1"
                  // error={form.formState.errors.name?.message}
                />
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-[1fr,auto] gap-4">
                  <div className="space-y-2">
                    <Input
                      {...form.register("color.name")}
                      placeholder="Color name (e.g., White)"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <Label>Hex</Label>
                        <Input
                          value={form.watch("color.hex")}
                          onChange={(e) =>
                            updateColorValues("hex", e.target.value)
                          }
                          placeholder="#000000"
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <Label>R</Label>
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={form.watch("color.red")}
                          onChange={(e) =>
                            updateColorValues("rgb", {
                              r: parseInt(e.target.value) || 0,
                              g: form.watch("color.green"),
                              b: form.watch("color.blue"),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>G</Label>
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={form.watch("color.green")}
                          onChange={(e) =>
                            updateColorValues("rgb", {
                              r: form.watch("color.red"),
                              g: parseInt(e.target.value) || 0,
                              b: form.watch("color.blue"),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>B</Label>
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={form.watch("color.blue")}
                          onChange={(e) =>
                            updateColorValues("rgb", {
                              r: form.watch("color.red"),
                              g: form.watch("color.green"),
                              b: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Popover
                      open={showColorPicker}
                      onOpenChange={setShowColorPicker}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-20 h-20 p-0 rounded-lg border-2"
                          style={{ backgroundColor: form.watch("color.hex") }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <HexColorPicker
                          color={form.watch("color.hex")}
                          onChange={(hex) => updateColorValues("hex", hex)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Frequency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    type="number"
                    min="1"
                    {...form.register("frequency", { valueAsNumber: true })}
                    className="mt-1"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setFrequency(e.target.value.toString());
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="frequencyInterval">Interval</Label>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("frequencyInterval", value as any);
                      setInterval(value.toString());
                    }}
                    defaultValue={form.getValues("frequencyInterval")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeIntervals.map((interval) => (
                        <SelectItem key={interval} value={interval}>
                          {interval.charAt(0).toUpperCase() + interval.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p>
                  {frequency}x per{" "}
                  <span style={{ textTransform: "lowercase" }}>{interval}</span>
                </p>
              </div>
              <hr />
            </div>

            {/* Reminders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Reminders</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      time: "09:00",
                      repeatInterval: "days",
                      repeatDays: [],
                      active: true,
                      snoozeDuration: 5,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Reminder {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        {...form.register(`reminders.${index}.time`)}
                      />
                    </div>
                    <div>
                      <Label>Repeat Interval</Label>
                      <Select
                        onValueChange={(value) =>
                          form.setValue(
                            `reminders.${index}.repeatInterval`,
                            value as any
                          )
                        }
                        defaultValue={field.repeatInterval}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeIntervals.map((interval) => (
                            <SelectItem key={interval} value={interval}>
                              {interval.charAt(0).toUpperCase() +
                                interval.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Repeat Days</Label>
                    <div className="flex gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <div
                          key={day.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`day-${index}-${day.value}`}
                            {...form.register(`reminders.${index}.repeatDays`)}
                            value={day.value}
                          />
                          <Label htmlFor={`day-${index}-${day.value}`}>
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Specific Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.specificDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.specificDate
                              ? format(field.specificDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.specificDate}
                            onSelect={(date) =>
                              form.setValue(
                                `reminders.${index}.specificDate`,
                                date
                              )
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Snooze Duration (minutes)</Label>
                      <Input
                        type="number"
                        min="1"
                        {...form.register(`reminders.${index}.snoozeDuration`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      {...form.register(`reminders.${index}.active`)}
                      defaultChecked={field.active}
                    />
                    <Label>Active</Label>
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Medication"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
