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
import { DRAFT_KEY, type Listing } from "./types";

const UNITS = ["Portions", "Kilograms", "Boxes", "Packs"] as const;
const CATEGORIES = ["Cooked", "Raw", "Packaged"] as const;

type Values = {
  food: string;
  quantity: string;
  unit: (typeof UNITS)[number];
  category: (typeof CATEGORIES)[number];
  expiry: string;
  useBefore: string;
  location: string;
  notes: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  food: "",
  quantity: "",
  unit: "Portions",
  category: "Cooked",
  expiry: "",
  useBefore: "",
  location: "",
  notes: "",
};

const draftStore = createLocalStore<Values>(DRAFT_KEY, EMPTY);

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={errorText}>{message}</p>;
}

export function ShareSurplusForm({
  onPublish,
}: {
  onPublish: (listing: Listing) => void;
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
    if (!values.food.trim()) next.food = "Add a food item name.";
    if (!values.quantity.trim()) next.quantity = "Enter a quantity.";
    else if (!(Number(values.quantity) > 0))
      next.quantity = "Quantity must be greater than 0.";
    if (!values.expiry) next.expiry = "Choose an expiry date.";
    if (!values.useBefore) next.useBefore = "Set a use-before time.";
    if (!values.location.trim()) next.location = "Add a pickup location.";
    return next;
  }

  async function handlePublish(event: FormEvent<HTMLFormElement>) {
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
        description: "Please sign in again to publish a donation.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/food-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: values.food.trim(),
          category: values.category,
          quantityServings: Number(values.quantity),
          quantityKg:
            values.unit === "Kilograms" ? Number(values.quantity) : null,
          expiryDate: values.expiry,
          expiryTime: values.useBefore,
          pickupAddress: values.location.trim(),
          specialInstructions: values.notes.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { listing?: Listing; error?: string }
        | null;

      if (!response.ok || !data?.listing) {
        throw new Error(data?.error ?? "Something went wrong.");
      }

      onPublish(data.listing);
      setValues(EMPTY);
      setErrors({});
      toast({
        tone: "success",
        title: "Donation published",
        description: "Your food item is now listed and visible to partners.",
      });
    } catch (error: unknown) {
      toast({
        tone: "error",
        title: "Couldn't publish",
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
      description: "Your donation details are stored on this device.",
    });
  }

  return (
    <section id="share-surplus" className={`${card} p-6 sm:p-8`}>
      <header>
        <h2 className="text-lg font-semibold text-forest-900">Share surplus</h2>
        <p className="mt-1 text-sm text-charcoal-600">
          Share safe surplus. We&apos;ll help find it a good home.
        </p>
      </header>

      <form className="mt-6 space-y-5" noValidate onSubmit={handlePublish}>
        <div>
          <label htmlFor="food" className={labelBase}>
            Food item name
          </label>
          <input
            id="food"
            name="food"
            type="text"
            value={values.food}
            onChange={(event) => update("food", event.target.value)}
            placeholder="e.g. Vegetable rice meals"
            aria-invalid={Boolean(errors.food)}
            aria-describedby={errors.food ? "food-error" : undefined}
            className={`${inputBase} ${errors.food ? inputError : ""}`}
          />
          <div id="food-error">
            <FieldError message={errors.food} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="quantity" className={labelBase}>
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              inputMode="numeric"
              value={values.quantity}
              onChange={(event) => update("quantity", event.target.value)}
              placeholder="60"
              aria-invalid={Boolean(errors.quantity)}
              aria-describedby={errors.quantity ? "quantity-error" : undefined}
              className={`${inputBase} ${errors.quantity ? inputError : ""}`}
            />
            <div id="quantity-error">
              <FieldError message={errors.quantity} />
            </div>
          </div>

          <div>
            <label htmlFor="unit" className={labelBase}>
              Unit
            </label>
            <select
              id="unit"
              name="unit"
              value={values.unit}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                update("unit", event.target.value as Values["unit"])
              }
              className={inputBase}
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
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
            <label htmlFor="expiry" className={labelBase}>
              Expiry date
            </label>
            <input
              id="expiry"
              name="expiry"
              type="date"
              value={values.expiry}
              onChange={(event) => update("expiry", event.target.value)}
              aria-invalid={Boolean(errors.expiry)}
              aria-describedby={errors.expiry ? "expiry-error" : undefined}
              className={`${inputBase} ${errors.expiry ? inputError : ""}`}
            />
            <div id="expiry-error">
              <FieldError message={errors.expiry} />
            </div>
          </div>

          <div>
            <label htmlFor="useBefore" className={labelBase}>
              Use before time
            </label>
            <input
              id="useBefore"
              name="useBefore"
              type="time"
              value={values.useBefore}
              onChange={(event) => update("useBefore", event.target.value)}
              aria-invalid={Boolean(errors.useBefore)}
              aria-describedby={errors.useBefore ? "useBefore-error" : undefined}
              className={`${inputBase} ${errors.useBefore ? inputError : ""}`}
            />
            <div id="useBefore-error">
              <FieldError message={errors.useBefore} />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="location" className={labelBase}>
            Pickup location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={values.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="e.g. 14 Mill Lane, back kitchen entrance"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
            className={`${inputBase} ${errors.location ? inputError : ""}`}
          />
          <div id="location-error">
            <FieldError message={errors.location} />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className={labelBase}>
            Pickup notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={values.notes}
            onChange={(event) => update("notes", event.target.value)}
            placeholder="Refrigerated since 14:00, use the side door and ask for Alex."
            className={`${inputBase} resize-none`}
          />
          <p className={`${helperText} mt-1.5 flex items-start gap-1.5`}>
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Food safety and storage information helps the recipient prepare
            safely.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <button type="submit" disabled={submitting} className={`${btnPrimary} sm:flex-1`}>
            <Check className="size-4" />
            {submitting ? "Publishing…" : "Publish donation"}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className={`${btnOutline} sm:flex-1`}
          >
            Save draft
          </button>
        </div>

        <p className={helperText}>
          Publishing makes this donation visible to matched community partners
          who can collect it.
        </p>
      </form>
    </section>
  );
}
