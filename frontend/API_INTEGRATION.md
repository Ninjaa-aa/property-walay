# API Integration Guide

This document describes how the frontend connects to the backend API.

## Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Pagination Configuration
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=20

# Supabase Configuration (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## API Client

The API client is located in `lib/api/client.ts` and provides:

- `apiGet<T>(endpoint, params?)` - GET requests
- `apiPost<T>(endpoint, data?)` - POST requests
- `apiPut<T>(endpoint, data?)` - PUT requests
- `apiDelete<T>(endpoint)` - DELETE requests

All methods include automatic error handling and type safety.

## Property API

Property-related API calls are in `lib/api/properties.ts`:

- `getProperties(params?)` - List properties with filters
- `getProperty(id)` - Get single property
- `getRecommendedProperties(limit?)` - Get recommended properties
- `createProperty(data)` - Create new property
- `updateProperty(id, data)` - Update property
- `deleteProperty(id)` - Delete property

## Hooks

### `useProperties(params?)`

Hook to fetch and manage properties list with pagination:

```typescript
const {
  properties,
  loading,
  error,
  total,
  page,
  pageSize,
  totalPages,
  refetch,
} = useProperties({
  source: "zameen",
  beds: 3,
  page: 1,
});
```

### `useRecommendedProperties(limit?)`

Hook to fetch recommended properties:

```typescript
const {
  properties,
  loading,
  error,
  refetch,
} = useRecommendedProperties(10);
```

## Pagination

Pagination is handled directly in the API service (`lib/api/properties.ts`):

- Default page size comes from `NEXT_PUBLIC_DEFAULT_PAGE_SIZE` env var (default: 20)
- Use the `Pagination` UI component from `@/components/ui/pagination` for rendering pagination controls

## Type Conversion

Utility functions in `lib/utils/property.ts`:

- `apiPropertyToDashboard(property)` - Convert API property to dashboard format
- `getPropertyImage(property)` - Extract first image URL
- `formatPropertyType(type)` - Format property type for display
- `formatAreaSize(size, unit)` - Format area size with unit

## Usage Example

```typescript
import { useRecommendedProperties } from "@/hooks/use-properties";
import { apiPropertyToDashboard } from "@/lib/utils/property";

function MyComponent() {
  const { properties, loading, error } = useRecommendedProperties(5);

  if (loading) return <Loading />;
  if (error) return <Error message={error.detail} />;

  return (
    <div>
      {properties.map((property) => (
        <PropertyCard
          key={property.our_id}
          property={apiPropertyToDashboard(property)}
        />
      ))}
    </div>
  );
}
```

## Error Handling

All API calls throw `ApiClientError` with:
- `status` - HTTP status code
- `detail` - Error message
- `message` - Error message (same as detail)

Handle errors in components:

```typescript
try {
  const properties = await getProperties();
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error(`API Error ${error.status}: ${error.detail}`);
  }
}
```

