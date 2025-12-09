# PropertyWalay Test Cases

## Module Coverage

This document contains test cases for the currently implemented modules in PropertyWalay:

### Modules with Test Cases:
1. **Real-Time Listings Integration Module** (4.2.1, 4.2.3, 4.2.4) - Property CRUD operations, listing retrieval, filtering, pagination, and cache utilities
2. **AI-Powered Recommendation Engine** (4.2.2) - Recommended properties endpoint

### Modules without Test Cases (Not Yet Implemented):
3. Natural Language Understanding (NLU) Module
4. Property Tracking and Notification Module
5. Investment Insights and Trends Module
6. Meeting Automation Module
7. Automated Presentation Generation Module
8. Location-Based Video Generation Module
9. User History and Profile Management Module
10. Multilingual and Voice Interface Module

## 4.2 Testing Details

### 4.2.1 Real-Time Listings Integration Module Test Cases

#### 4.2.1.1 Test Case 1: List Properties (Real-Time Listings Integration Module)

**Description:** This test case validates the successful retrieval of properties with optional filters and pagination. The `list_properties` endpoint should return a paginated list of properties matching the specified criteria.

**Endpoint:** `GET /api/v1/properties`

**Input Data:**
- `source`: "zameen"
- `prop_type`: "apartment"
- `beds`: 3
- `min_price`: 5000000
- `max_price`: 15000000
- `page`: 1
- `page_size`: 20

**Assertions:**
- Status code is 200.
- Response contains `items` field (list of properties).
- Response contains `total` field (total count).
- Response contains `page` field.
- Response contains `page_size` field.
- Response contains `total_pages` field.
- All returned properties match the filter criteria.
- Properties are ordered by `updated_at` descending.
- Cache is checked before database query.
- Cache is set after successful query with TTL of 300 seconds.

#### 4.2.1.2 Test Case 2: List Properties with Cache Hit (Real-Time Listings Integration Module)

**Description:** This test case validates that when cached data exists, the `list_properties` endpoint returns cached results without querying the database.

**Endpoint:** `GET /api/v1/properties?source=graana&page=1&page_size=10`

**Input Data:**
- `source`: "graana"
- `page`: 1
- `page_size`: 10

**Assertions:**
- Status code is 200.
- Response is returned from cache.
- Database query is not executed.
- Response structure matches `PropertyListResponse` schema.

#### 4.2.1.3 Test Case 3: List Properties with All Filters (Real-Time Listings Integration Module)

**Description:** This test case validates the `list_properties` endpoint with all available filter parameters applied simultaneously.

**Endpoint:** `GET /api/v1/properties`

**Input Data:**
- `source`: "lamudi"
- `prop_type`: "house"
- `prop_subtype`: "villa"
- `beds`: 4
- `baths`: 3
- `min_price`: 10000000
- `max_price`: 25000000
- `currency`: "PKR"
- `area_name`: "DHA Phase 5"
- `min_area_size`: 2000
- `max_area_size`: 5000
- `page`: 1
- `page_size`: 50

**Assertions:**
- Status code is 200.
- All filter parameters are applied correctly.
- Response contains filtered properties matching all criteria.
- Cache key includes all filter parameters.

#### 4.2.1.4 Test Case 4: List Properties with Invalid Filters (Real-Time Listings Integration Module)

**Description:** This test case validates that the `list_properties` endpoint handles invalid filter parameters correctly, such as negative prices or invalid source values.

**Endpoint:** `GET /api/v1/properties?min_price=-1000&page_size=200`

**Input Data:**
- `min_price`: -1000
- `page_size`: 200

**Assertions:**
- Status code is 422 (Validation Error).
- Error message indicates invalid parameter values.
- Database query is not executed.

#### 4.2.1.5 Test Case 5: List Properties with Pagination Edge Cases (Real-Time Listings Integration Module)

**Description:** This test case validates pagination behavior with edge cases such as page number exceeding total pages and maximum page size.

**Endpoint:** `GET /api/v1/properties?page=999&page_size=100`

**Input Data:**
- `page`: 999
- `page_size`: 100

**Assertions:**
- Status code is 200.
- Response contains empty `items` list when page exceeds total pages.
- `total_pages` is calculated correctly.
- `page_size` respects maximum limit of 100.

#### 4.2.1.6 Test Case 6: Get Property by ID (Real-Time Listings Integration Module)

**Description:** This test case verifies the `get_property` endpoint. The test ensures that a single property can be retrieved successfully by its UUID.

**Endpoint:** `GET /api/v1/properties/{property_id}`

**Input Data:**
- `property_id`: "550e8400-e29b-41d4-a716-446655440000" (UUID)

**Assertions:**
- Status code is 200.
- Response contains `our_id` field matching the requested ID.
- Response contains all required property fields (`title`, `source`, `current_price`, `beds`, `baths`, `area_name`, etc.).
- Response structure matches `PropertyResponse` schema.

#### 4.2.1.7 Test Case 7: Get Property Not Found (Real-Time Listings Integration Module)

**Description:** This test case handles the scenario where the specified property ID does not exist. The `get_property` endpoint should raise an HTTPException with 404 status.

**Endpoint:** `GET /api/v1/properties/{property_id}`

**Input Data:**
- `property_id`: "00000000-0000-0000-0000-000000000000" (non-existent UUID)

**Assertions:**
- Status code is 404.
- Error detail message indicates property not found.
- Response contains appropriate error message: "Property with ID {property_id} not found".

#### 4.2.1.8 Test Case 8: Get Property with Invalid UUID Format (Real-Time Listings Integration Module)

**Description:** This test case validates that the `get_property` endpoint handles invalid UUID format correctly.

**Endpoint:** `GET /api/v1/properties/{property_id}`

**Input Data:**
- `property_id`: "invalid-uuid-format"

**Assertions:**
- Status code is 422 (Validation Error).
- Error message indicates invalid UUID format.

#### 4.2.1.9 Test Case 9: Create Property (Real-Time Listings Integration Module)

**Description:** This test case verifies the `create_property` endpoint. The test ensures that a new property can be created successfully with valid data.

**Endpoint:** `POST /api/v1/properties`

**Input Data:**
```json
{
  "source": "zameen",
  "source_id": "12345",
  "title": "3 Bed Apartment in DHA Phase 5",
  "prop_type": "apartment",
  "prop_subtype": "flat",
  "beds": 3,
  "baths": 2,
  "area_size": 1800,
  "area_unit": "sqft",
  "area_name": "DHA Phase 5",
  "current_price": 12000000,
  "currency": "PKR",
  "latitude": 24.8607,
  "longitude": 67.0011,
  "link": "https://zameen.com/property/12345"
}
```

**Assertions:**
- Status code is 201.
- Response contains `our_id` field (UUID).
- Response contains all provided property data.
- Property is saved in database.
- Cache is invalidated after creation (all property cache keys deleted).
- Response structure matches `PropertyResponse` schema.

#### 4.2.1.10 Test Case 10: Create Property Duplicate (Real-Time Listings Integration Module)

**Description:** This test case handles the scenario where a property with the same `source` and `source_id` already exists. The `create_property` endpoint should raise an HTTPException with 400 status.

**Endpoint:** `POST /api/v1/properties`

**Input Data:**
```json
{
  "source": "zameen",
  "source_id": "12345",
  "title": "Duplicate Property"
}
```

**Assertions:**
- Status code is 400.
- Error detail message indicates duplicate property: "Property with source 'zameen' and source_id '12345' already exists".
- Property is not created in database.

#### 4.2.1.11 Test Case 11: Create Property with Missing Required Fields (Real-Time Listings Integration Module)

**Description:** This test case validates that the `create_property` endpoint requires `source` and `source_id` fields.

**Endpoint:** `POST /api/v1/properties`

**Input Data:**
```json
{
  "title": "Property without source"
}
```

**Assertions:**
- Status code is 422 (Validation Error).
- Error message indicates missing required fields.
- Property is not created in database.

#### 4.2.1.12 Test Case 12: Update Property (Real-Time Listings Integration Module)

**Description:** This test case verifies the `update_property` endpoint. The test ensures that a property's details can be updated successfully.

**Endpoint:** `PUT /api/v1/properties/{property_id}`

**Input Data:**
- `property_id`: "550e8400-e29b-41d4-a716-446655440000"
```json
{
  "current_price": 11500000,
  "title": "Updated Property Title"
}
```

**Assertions:**
- Status code is 200.
- Response contains updated `current_price`.
- Response contains updated `title`.
- `last_price_change_at` is updated when price changes.
- Cache is invalidated after update (all property cache keys deleted).
- Response structure matches `PropertyResponse` schema.

#### 4.2.1.13 Test Case 13: Update Property Not Found (Real-Time Listings Integration Module)

**Description:** This test case handles the scenario where the property to be updated does not exist. The `update_property` endpoint should raise an HTTPException with 404 status.

**Endpoint:** `PUT /api/v1/properties/{property_id}`

**Input Data:**
- `property_id`: "00000000-0000-0000-0000-000000000000"
```json
{
  "title": "Updated Title"
}
```

**Assertions:**
- Status code is 404.
- Error detail message indicates property not found.
- Property is not updated in database.

#### 4.2.1.14 Test Case 14: Update Property Partial Fields (Real-Time Listings Integration Module)

**Description:** This test case validates that the `update_property` endpoint only updates provided fields, leaving other fields unchanged.

**Endpoint:** `PUT /api/v1/properties/{property_id}`

**Input Data:**
- `property_id`: "550e8400-e29b-41d4-a716-446655440000"
```json
{
  "beds": 4
}
```

**Assertions:**
- Status code is 200.
- Only `beds` field is updated.
- Other fields remain unchanged.
- Response contains updated property data.

#### 4.2.1.15 Test Case 15: Delete Property (Real-Time Listings Integration Module)

**Description:** This test case verifies the `delete_property` endpoint. The test ensures that a property can be deleted successfully.

**Endpoint:** `DELETE /api/v1/properties/{property_id}`

**Input Data:**
- `property_id`: "550e8400-e29b-41d4-a716-446655440000"

**Assertions:**
- Status code is 204.
- Property is deleted from database.
- Cache is invalidated after deletion (all property cache keys deleted).
- Response body is empty.

#### 4.2.1.16 Test Case 16: Delete Property Not Found (Real-Time Listings Integration Module)

**Description:** This test case handles the scenario where the property to be deleted does not exist. The `delete_property` endpoint should raise an HTTPException with 404 status.

**Endpoint:** `DELETE /api/v1/properties/{property_id}`

**Input Data:**
- `property_id`: "00000000-0000-0000-0000-000000000000"

**Assertions:**
- Status code is 404.
- Error detail message indicates property not found.
- Property is not deleted from database.

### 4.2.2 AI-Powered Recommendation Engine Test Cases

#### 4.2.2.1 Test Case 17: Get Recommended Properties (AI-Powered Recommendation Engine)

**Description:** This test case verifies the `get_recommended_properties` endpoint. The test ensures that recommended properties can be retrieved successfully.

**Endpoint:** `GET /api/v1/properties/search/recommended`

**Input Data:**
- `limit`: 10

**Assertions:**
- Status code is 200.
- Response is a list of properties.
- Number of properties returned is less than or equal to `limit`.
- Properties are ordered by `updated_at` descending.
- Cache is checked before database query.
- Cache TTL is 120 seconds (2 minutes).

#### 4.2.2.2 Test Case 18: Get Recommended Properties with Cache Hit (AI-Powered Recommendation Engine)

**Description:** This test case validates that when cached data exists, the `get_recommended_properties` endpoint returns cached results.

**Endpoint:** `GET /api/v1/properties/search/recommended?limit=5`

**Input Data:**
- `limit`: 5

**Assertions:**
- Status code is 200.
- Response is returned from cache.
- Database query is not executed.
- Response is a list of `PropertyResponse` objects.

#### 4.2.2.3 Test Case 19: Get Recommended Properties with Invalid Limit (AI-Powered Recommendation Engine)

**Description:** This test case validates that the `get_recommended_properties` endpoint enforces limit constraints (1-50).

**Endpoint:** `GET /api/v1/properties/search/recommended?limit=100`

**Input Data:**
- `limit`: 100

**Assertions:**
- Status code is 422 (Validation Error).
- Error message indicates limit exceeds maximum value of 50.

### 4.2.3 Real-Time Listings Integration Module - System Endpoints Test Cases

#### 4.2.3.1 Test Case 20: Root Endpoint (Real-Time Listings Integration Module)

**Description:** This test case verifies the root endpoint returns API information.

**Endpoint:** `GET /`

**Input Data:**
- None

**Assertions:**
- Status code is 200.
- Response contains `message` field.
- Response contains `version` field.
- Response contains `docs` field.

#### 4.2.3.2 Test Case 21: Health Check Endpoint (Real-Time Listings Integration Module)

**Description:** This test case verifies the health check endpoint returns system status.

**Endpoint:** `GET /health`

**Input Data:**
- None

**Assertions:**
- Status code is 200.
- Response contains `status` field with value "healthy".
- Response contains `redis` field indicating connection status ("connected" or "disconnected").

### 4.2.4 Real-Time Listings Integration Module - Cache Utility Test Cases

#### 4.2.4.1 Test Case 22: Get Cache Key (Real-Time Listings Integration Module)

**Description:** This test case validates the `get_cache_key` function. The function should generate consistent cache keys from prefix and parameters.

**Function:** `get_cache_key(prefix: str, *args, **kwargs) -> str`

**Mocked Functions:**
- None (pure function, no external dependencies)

**Assertions:**
- Generated key is a string.
- Key contains the prefix.
- Key contains all provided parameters.
- Parameters are sorted for consistency.
- None values are excluded from key.
- Key format is: `prefix:param1:value1:param2:value2`.

#### 4.2.4.2 Test Case 23: Get Cache Key with None Values (Real-Time Listings Integration Module)

**Description:** This test case validates that `get_cache_key` excludes None values from the generated key.

**Function:** `get_cache_key(prefix: str, *args, **kwargs) -> str`

**Mocked Functions:**
- None

**Assertions:**
- None values in args are excluded from key.
- None values in kwargs are excluded from key.
- Key only contains non-None parameters.

#### 4.2.4.3 Test Case 24: Get From Cache Success (Real-Time Listings Integration Module)

**Description:** This test case validates the `get_from_cache` function when cached data exists. The function should retrieve and deserialize cached data successfully.

**Function:** `get_from_cache(key: str) -> Optional[Any]`

**Mocked Functions:**
- `redis_client.get` (returns JSON string)

**Assertions:**
- Function returns deserialized data when key exists.
- Function correctly parses JSON string.
- Function returns the expected data structure.

#### 4.2.4.4 Test Case 25: Get From Cache Key Not Found (Real-Time Listings Integration Module)

**Description:** This test case validates the `get_from_cache` function when the key does not exist in cache.

**Function:** `get_from_cache(key: str) -> Optional[Any]`

**Mocked Functions:**
- `redis_client.get` (returns None)

**Assertions:**
- Function returns None when key doesn't exist.
- No exception is raised.

#### 4.2.4.5 Test Case 26: Get From Cache JSON Decode Error (Real-Time Listings Integration Module)

**Description:** This test case validates that `get_from_cache` handles JSON decode errors gracefully.

**Function:** `get_from_cache(key: str) -> Optional[Any]`

**Mocked Functions:**
- `redis_client.get` (returns invalid JSON string)
- `json.loads` (raises JSONDecodeError)

**Assertions:**
- Function returns None on JSON decode error.
- Error is logged but not raised.
- No exception propagates to caller.

#### 4.2.4.6 Test Case 27: Get From Cache Redis Error (Real-Time Listings Integration Module)

**Description:** This test case validates that `get_from_cache` handles Redis connection errors gracefully.

**Function:** `get_from_cache(key: str) -> Optional[Any]`

**Mocked Functions:**
- `redis_client.get` (raises RedisError)

**Assertions:**
- Function returns None on Redis error.
- Error is logged but not raised.
- No exception propagates to caller.

#### 4.2.4.7 Test Case 28: Set Cache Success (Real-Time Listings Integration Module)

**Description:** This test case validates the `set_cache` function. The function should serialize and store data in cache with TTL.

**Function:** `set_cache(key: str, value: Any, ttl: int = None) -> bool`

**Mocked Functions:**
- `redis_client.setex`

**Assertions:**
- Function returns True on successful cache set.
- Data is serialized to JSON.
- TTL is applied correctly.
- Function uses default TTL from settings when ttl is None.

#### 4.2.4.8 Test Case 29: Set Cache with Custom TTL (Real-Time Listings Integration Module)

**Description:** This test case validates that `set_cache` uses custom TTL when provided.

**Function:** `set_cache(key: str, value: Any, ttl: int = None) -> bool`

**Mocked Functions:**
- `redis_client.setex`

**Assertions:**
- Function uses provided TTL value.
- `redis_client.setex` is called with correct TTL.
- Function returns True on success.

#### 4.2.4.9 Test Case 30: Set Cache Redis Error (Real-Time Listings Integration Module)

**Description:** This test case validates that `set_cache` handles Redis connection errors gracefully.

**Function:** `set_cache(key: str, value: Any, ttl: int = None) -> bool`

**Mocked Functions:**
- `redis_client.setex` (raises RedisError)

**Assertions:**
- Function returns False on Redis error.
- Error is logged but not raised.
- No exception propagates to caller.

#### 4.2.4.10 Test Case 31: Set Cache Type Error (Real-Time Listings Integration Module)

**Description:** This test case validates that `set_cache` handles serialization errors (TypeError) gracefully.

**Function:** `set_cache(key: str, value: Any, ttl: int = None) -> bool`

**Mocked Functions:**
- `json.dumps` (raises TypeError for non-serializable objects)

**Assertions:**
- Function returns False on TypeError.
- Error is logged but not raised.
- No exception propagates to caller.

#### 4.2.4.11 Test Case 32: Delete Cache Success (Real-Time Listings Integration Module)

**Description:** This test case validates the `delete_cache` function. The function should delete a single key from cache.

**Function:** `delete_cache(key: str) -> bool`

**Mocked Functions:**
- `redis_client.delete`

**Assertions:**
- Function returns True on successful deletion.
- `redis_client.delete` is called with correct key.

#### 4.2.4.12 Test Case 33: Delete Cache Redis Error (Real-Time Listings Integration Module)

**Description:** This test case validates that `delete_cache` handles Redis connection errors gracefully.

**Function:** `delete_cache(key: str) -> bool`

**Mocked Functions:**
- `redis_client.delete` (raises RedisError)

**Assertions:**
- Function returns False on Redis error.
- Error is logged but not raised.
- No exception propagates to caller.

#### 4.2.4.13 Test Case 34: Delete Cache Pattern Success (Real-Time Listings Integration Module)

**Description:** This test case validates the `delete_cache_pattern` function. The function should delete all keys matching a pattern.

**Function:** `delete_cache_pattern(pattern: str) -> int`

**Mocked Functions:**
- `redis_client.keys`
- `redis_client.delete`

**Assertions:**
- Function returns number of keys deleted.
- All matching keys are deleted.
- Function returns 0 when no keys match pattern.

#### 4.2.4.14 Test Case 35: Delete Cache Pattern with Multiple Keys (Real-Time Listings Integration Module)

**Description:** This test case validates that `delete_cache_pattern` correctly handles deletion of multiple matching keys.

**Function:** `delete_cache_pattern(pattern: str) -> int`

**Mocked Functions:**
- `redis_client.keys` (returns list of 5 keys)
- `redis_client.delete`

**Assertions:**
- Function returns 5 (number of keys deleted).
- All 5 keys are passed to `redis_client.delete`.
- Function handles multiple keys correctly.

#### 4.2.4.15 Test Case 36: Delete Cache Pattern Redis Error (Real-Time Listings Integration Module)

**Description:** This test case validates that `delete_cache_pattern` handles Redis connection errors gracefully.

**Function:** `delete_cache_pattern(pattern: str) -> int`

**Mocked Functions:**
- `redis_client.keys` (raises RedisError)

**Assertions:**
- Function returns 0 on Redis error.
- Error is logged but not raised.
- No exception propagates to caller.

#### 4.2.4.16 Test Case 37: Clear All Cache (Real-Time Listings Integration Module)

**Description:** This test case validates the `clear_all_cache` function. The function should clear all cache data.

**Function:** `clear_all_cache() -> bool`

**Mocked Functions:**
- `redis_client.flushdb`

**Assertions:**
- Function returns True on successful clear.
- `redis_client.flushdb` is called.

#### 4.2.4.17 Test Case 38: Clear All Cache Redis Error (Real-Time Listings Integration Module)

**Description:** This test case validates that `clear_all_cache` handles Redis connection errors gracefully.

**Function:** `clear_all_cache() -> bool`

**Mocked Functions:**
- `redis_client.flushdb` (raises RedisError)

**Assertions:**
- Function returns False on Redis error.
- Error is logged but not raised.
- No exception propagates to caller.

#### 4.2.4.18 Test Case 39: Test Redis Connection Success (Real-Time Listings Integration Module)

**Description:** This test case validates the `test_connection` function when Redis is connected.

**Function:** `test_connection() -> bool`

**Mocked Functions:**
- `redis_client.ping` (returns True)

**Assertions:**
- Function returns True when Redis is connected.
- `redis_client.ping` is called.

#### 4.2.4.19 Test Case 40: Test Redis Connection Failure (Real-Time Listings Integration Module)

**Description:** This test case validates the `test_connection` function when Redis is disconnected.

**Function:** `test_connection() -> bool`

**Mocked Functions:**
- `redis_client.ping` (raises RedisError)

**Assertions:**
- Function returns False when Redis is disconnected.
- No exception propagates to caller.
