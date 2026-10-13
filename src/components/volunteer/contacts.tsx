"use client";

import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { MessageCircle, Phone } from "@/components/ui/icons";
import { card } from "@/components/ui/styles";
import { CONTACTS } from "./types";

export function ContactsCard() {
  const toast = useToast();

  return (
    <section className={`${card} p-6`}>
      <h2 className="text-lg font-semibold text-forest-900">Delivery contacts</h2>
      <ul className="mt-4 space-y-4">
        {CONTACTS.map((contact) => (
          <li key={contact.name} className="flex items-center gap-3">
            <Avatar name={contact.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-forest-900">
                {contact.name}
              </p>
              <p className="truncate text-xs text-charcoal-400">
                {contact.role}
              </p>
              <p className="truncate text-xs text-charcoal-500">
                {contact.detail}
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                aria-label={`Call ${contact.name}`}
                onClick={() =>
                  toast({
                    tone: "info",
                    title: `Calling ${contact.name}`,
                    description: "Opening the contact number.",
                  })
                }
                className="grid size-9 place-items-center rounded-full border border-sage-200 text-forest-700 transition hover:bg-sage-100"
              >
                <Phone className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Message ${contact.name}`}
                onClick={() =>
                  toast({
                    tone: "info",
                    title: `Message ${contact.name}`,
                    description: "Opening your messages.",
                  })
                }
                className="grid size-9 place-items-center rounded-full border border-sage-200 text-forest-700 transition hover:bg-sage-100"
              >
                <MessageCircle className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
