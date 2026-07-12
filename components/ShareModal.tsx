"use client";

import { useState, type ReactNode } from "react";
import { SiInstagram, SiFacebook, SiWhatsapp, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { Modal } from "@/components/ui/Modal";
import { ShareCard, type ShareCardProps } from "@/components/ShareCard";

const SOCIALS = [
  { name: "X", Icon: SiX, color: "#000000" },
  { name: "Instagram", Icon: SiInstagram, color: "#E1306C" },
  { name: "Facebook", Icon: SiFacebook, color: "#1877F2" },
  { name: "WhatsApp", Icon: SiWhatsapp, color: "#25D366" },
  { name: "LinkedIn", Icon: FaLinkedin, color: "#0A66C2" },
] as const;

type ShareModalProps = ShareCardProps & { trigger: ReactNode };

export function ShareModal({ trigger, ...cardProps }: ShareModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span className="inline-block" onClick={() => setOpen(true)}>
        {trigger}
      </span>
      <Modal open={open} onClose={() => setOpen(false)} labelledBy="share-modal-title">
        <h2 id="share-modal-title" className="sr-only">
          Share your progress
        </h2>
        <ShareCard {...cardProps} />
        <div className="mt-6 flex items-center justify-center gap-3">
          {SOCIALS.map(({ name, Icon, color }) => (
            <span
              key={name}
              role="img"
              aria-label={name}
              title={name}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              <Icon size={18} />
            </span>
          ))}
        </div>
      </Modal>
    </>
  );
}
