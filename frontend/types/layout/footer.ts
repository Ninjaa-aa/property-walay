import type { LucideIcon } from "lucide-react";

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkSection {
  product: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
  support: FooterLink[];
}

export interface SocialLink {
  name: string;
  icon: LucideIcon;
  href: string;
}

