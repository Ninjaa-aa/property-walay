import type { Activity } from "@/types/dashboard/activity";

export const dashboardActivities: Activity[] = [
  {
    id: "1",
    type: "save",
    title: 'You saved "3 Bed Apartment in DHA Lahore"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    propertyId: "prop-1",
  },
  {
    id: "2",
    type: "price_change",
    title: 'Price dropped 5% on your saved property',
    description: '"Plot in Bahria Town"',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    propertyId: "prop-2",
  },
  {
    id: "3",
    type: "new_matches",
    title: "8 new properties match your search criteria",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  },
  {
    id: "4",
    type: "meeting",
    title: "Meeting scheduled with Agent Sarah Ahmed",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "5",
    type: "view",
    title: 'You viewed "5 Marla House in Gulberg"',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    propertyId: "prop-3",
  },
];

