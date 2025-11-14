import type { SocialLink } from "@/types/layout/footer";
import { Github, Twitter, Linkedin } from "lucide-react";

export const socialLinks: SocialLink[] = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "GitHub", icon: Github, href: "https://github.com" },
];

