"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useToast } from "@/components/ui/toast";
import { Check, Info } from "@/components/ui/icons";
import {
  btnOutline,
  btnPrimary,
  card,
  errorText,
  helperText,
  inputBase,
  inputError,
  labelBase,
} from "@/components/ui/styles";
import { createLocalStore, useLocalStore } from "@/lib/local-store";
import { useSession } from "@/lib/session";
import {
  CATEGORIES,
  REQUEST_DRAFT_KEY,
  URGENCIES,
  type FoodRequest,
  type RequestCategory,
  type Urgency,
} from "./types";

type Values = {
  food: string;
  category: RequestCategory;
  servings: string;
  date: string;
  time: string;
  urgency: Urgency;
  area: string;
  note: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  food: "",
  category: "Cooked",
  servings: "",
  date: "",
  time: "",
  urgency: "Normal",
  area: "",
  note: "",
};

const draftStore = createLocalStore<Values>(REQUEST_DRAFT_KEY, EMPTY);

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={errorText}>{message}</p>;
}

export function NewRequestForm({
  onAdd,
}: {
  onAdd: (request: FoodRequest) => void;
}) {
  const toast = useToast();
  const user = useSession();
  const [values, setValues] = useLocalStore(draftStore);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.food.trim()) next.food = "Add the food you need.";
    if (!values.servings.trim()) next.servings = "Enter how many servings.";
    else if (!(Number(values.servings) > 0))
      next.servings = "Servings must be greater than 0.";
    if (!values.date) next.date = "Choose a date.";
    if (!values.area.trim()) next.area = "Add a delivery area.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast({
        tone: "warning",
        title: "Please fix the highlighted fields",
        description: "A few required details are still missing.",
      });
      return;
    }

    if (!user) {
      toast({
        tone: "error",
        title: "Not signed in",
        description: "Please sign in again to post a request.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/food-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: values.food.trim(),
          category: values.category,
          quantityServings: Math.round(Number(values.servings)),
          neededByDate: values.date,
          neededByTime: values.time,
          urgency: values.urgency,
          deliveryArea: values.area.trim(),
          notes: values.note.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { request?: FoodRequest; error?: string }
        | null;

      if (!response.ok || !data?.request) {
        throw new Error(data?.error ?? "Something went wrong.");
      }

      onAdd(data.request);
      setValues(EMPTY);
      setErrors({});
      toast({
        tone: "success",
        title: "Request posted",
        description: "We're matching your request with nearby donors now.",
      });
    } catch (error: unknown) {
      toast({
        tone: "error",
        title: "Couldn't post request",
        description:
          error instanceof Error && error.message
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleSaveDraft() {
    setValues(values);
    toast({
      tone: "info",
      title: "Draft saved",
      description: "Your request details are stored on this device.",
    });
  }

  return (
    <section id="new-request" className={`${card} scroll-mt-24 p-6 sm:p-8`}>
      <header>
        <h2 className="text-lg font-semibold text-forest-900">
          Request food
        </h2>
        <p className="mt-1 text-sm text-charcoal-600">
          Tell us what your community needs and we&apos;ll find a match nearby.
        </p>
      </header>

      <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
        <div>
          <label htmlFor="req-food" className={labelBase}>
            What do you need?
          </label>
          <input
            id="req-food"
            name="food"
            type="text"
            value={values.food}
            onChange={(event) => update("food", event.target.value)}
            placeholder="e.g. Cooked evening meals"
            aria-invalid={Boolean(errors.food)}
            aria-describedby={errors.food ? "req-food-error" : undefined}
            className={`${inputBase} ${errors.food ? inputError : ""}`}
          />
          <div id="req-food-error">
            <FieldError message={errors.food} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="req-servings" className={labelBase}>
              Servings needed
            </label>
            <input
              id="req-servings"
              name="servings"
              type="number"
              min="1"
              inputMode="numeric"
              value={values.servings}
              onChange={(event) => update("servings", event.target.value)}
              placeholder="80"
              aria-invalid={Boolean(errors.servings)}
              aria-describedby={
                errors.servings ? "req-servings-error" : undefined
              }
              className={`${inputBase} ${errors.servings ? inputError : ""}`}
            />
            <div id="req-servings-error">
              <FieldError message={errors.servings} />
            </div>
          </div>

          <div>
            <label htmlFor="req-urgency" className={labelBase}>
              Urgency
            </label>
            <select
              id="req-urgency"
              name="urgency"
              value={values.urgency}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                update("urgency", event.target.value as Urgency)
              }
              className={inputBase}
            >
              {URGENCIES.map((urgency) => (
                <option key={urgency} value={urgency}>
                  {urgency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className={labelBase}>Category</legend>
          <div
            role="radiogroup"
            aria-label="Category"
            className="grid grid-cols-3 gap-2"
          >
            {CATEGORIES.map((category) => {
              const active = values.category === category;
              return (
                <label
                  key={category}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-amber-500 ${
                    active
                      ? "border-forest-500 bg-mint-100 text-forest-800"
                      : "border-sage-300 bg-white text-charcoal-600 hover:bg-sage-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={active}
                    onChange={() => update("category", category)}
                    className="sr-only"
                  />
                  {category}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="req-date" className={labelBase}>
              Needed by date
            </label>
            <input
              id="req-date"
              name="date"
              type="date"
              value={values.date}
              onChange={(event) => update("date", event.target.value)}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? "req-date-error" : undefined}
              className={`${inputBase} ${errors.date ? inputError : ""}`}
            />
            <div id="req-date-error">
              <FieldError message={errors.date} />
            </div>
          </div>

          <div>
            <label htmlFor="req-time" className={labelBase}>
              Time (optional)
            </label>
            <input
              id="req-time"
              name="time"
              type="time"
              value={values.time}
              onChange={(event) => update("time", event.target.value)}
              className={inputBase}
            />
          </div>
        </div>

        <div>
          <label htmlFor="req-area" className={labelBase}>
            Delivery area
          </label>
          <input
            id="req-area"
            name="area"
            type="text"
            value={values.area}
            onChange={(event) => update("area", event.target.value)}
            placeholder="e.g. Northgate Community Hall"
            aria-invalid={Boolean(errors.area)}
            aria-describedby={errors.area ? "req-area-error" : undefined}
            className={`${inputBase} ${errors.area ? inputError : ""}`}
          />
          <div id="req-area-error">
            <FieldError message={errors.area} />
          </div>
        </div>

        <div>
          <label htmlFor="req-note" className={labelBase}>
            Notes (optional)
          </label>
          <textarea
            id="req-note"
            name="note"
            rows={3}
            value={values.note}
            onChange={(event) => update("note", event.target.value)}
            placeholder="Dietary needs, access instructions or storage requirements."
            className={`${inputBase} resize-none`}
          />
          <p className={`${helperText} mt-1.5 flex items-start gap-1.5`}>
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Clear details help donors and volunteers prepare the right food.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className={`${btnPrimary} sm:flex-1`}
          >
            <Check className="size-4" />
            {submitting ? "Posting…" : "Post request"}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className={`${btnOutline} sm:flex-1`}
          >
            Save draft
          </button>
        </div>
      </form>
    </section>
  );
}
