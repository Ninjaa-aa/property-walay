import type { Meeting } from "@/types/dashboard/meeting";

export const upcomingMeetings: Meeting[] = [
  {
    id: "meeting-1",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    time: "10:00 AM",
    agentName: "Sarah Ahmed",
    propertyTitle: "5 Marla Plot",
    propertyLocation: "DHA Lahore",
  },
  {
    id: "meeting-2",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Nov 18
    time: "2:00 PM",
    agentName: "Ali Raza",
    propertyTitle: "3 Bed Apartment",
    propertyLocation: "Bahria Town",
  },
];

