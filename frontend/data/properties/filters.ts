export interface FilterOption {
  value: string;
  label: string;
}

export const propertyTypeOptions: FilterOption[] = [
  { value: "commercial", label: "Commercial" },
  { value: "residential", label: "Homes / Residential" },
  { value: "plots", label: "Plots" },
];

export const listingTypeOptions: FilterOption[] = [
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
];

export const bedOptions: FilterOption[] = [
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Beds" },
  { value: "3", label: "3 Beds" },
  { value: "4", label: "4 Beds" },
  { value: "5", label: "5+ Beds" },
];

export const bathOptions: FilterOption[] = [
  { value: "1", label: "1 Bath" },
  { value: "2", label: "2 Baths" },
  { value: "3", label: "3 Baths" },
  { value: "4", label: "4+ Baths" },
];

export const sourceOptions: FilterOption[] = [
  { value: "zameen", label: "Zameen" },
  { value: "graana", label: "Graana" },
  { value: "lamudi", label: "Lamudi" },
];
