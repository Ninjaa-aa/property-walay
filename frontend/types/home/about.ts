import type { LucideIcon } from "lucide-react";

export interface AboutValue {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AboutStat {
  label: string;
  value: string;
  description?: string;
}

export interface AboutMission {
  title: string;
  description: string;
  values: AboutValue[];
}

export interface AboutTeamMember {
  name: string;
  role: string;
  description: string;
  image?: string;
}
