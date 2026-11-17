# Public Service Catalog API

The public service pages read the `services` collection from the MongoDB database configured by `MONGODB_URI` and optional `MONGODB_DATABASE` (defaults to `fixmate`). Set `MONGODB_URI` to a reachable MongoDB deployment before using the catalog; there is no static-data fallback for these routes. Listing and detail results are always limited to documents with `status: "approved"` and `available: true`. Pending, rejected, or unavailable services are not exposed.

## `GET /api/services`

Returns a server-filtered, server-sorted, and server-paginated service list.

| Query parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `q` | string | empty | Case-insensitive title or category search (maximum 100 characters). |
| `category` | string | all | Exact category: `Smartphone`, `Laptop & PC`, `AC`, `Refrigerator`, `TV`, `Washing Machine`, or `Electrical`. |
| `serviceMode` | string | all | Exact `serviceMode` stored on a service document. Available values are returned in `filters.serviceModes`; no mode values are assumed by the client. |
| `sort` | `newest`, `price-asc`, `price-desc` | `newest` | Sort by publication date descending, price ascending, or price descending. |
| `page` | positive integer | `1` | One-based page number. |
| `limit` | integer from 1 to 24 | `6` | Number of results per page. |

Example:

```http
GET /api/services?q=screen&category=Smartphone&sort=price-asc&page=1&limit=6
```

Success response (`200`):

```json
{
  "data": [
    {
      "id": "smartphone-screen-repair",
      "title": "Smartphone Screen Repair",
      "category": "Smartphone",
      "shortDescription": "Crystal-clear glass replacement.",
      "description": "Full service description.",
      "price": 129,
      "duration": "45-60 mins",
      "status": "approved",
      "available": true,
      "publishedAt": "2026-11-17T09:00:00.000Z",
      "image": "https://example.test/service.jpg",
      "serviceMode": "in-home"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 1,
    "totalPages": 1
  },
  "filters": {
    "serviceModes": ["in-home"]
  }
}
```

Errors: `400` for invalid or repeated query parameters; `500` if the catalog cannot be queried. The browser-facing `/services` page uses the same repository and query rules, and keeps filter, search, sort, and page state in its URL.

## `GET /api/services/[id]`

Returns one approved and available service by its public `id`. When a document has no `id`, its MongoDB ObjectId is used. Unapproved, unavailable, and missing services all return `404`.

Example:

```http
GET /api/services/smartphone-screen-repair
```

Success response (`200`):

```json
{ "data": { "id": "smartphone-screen-repair", "title": "Smartphone Screen Repair" } }
```

Errors: `404` if no public service matches; `500` if MongoDB is unavailable.

## MongoDB service document

Documents in `services` should have `id` (recommended stable URL slug), `title`, `category`, `shortDescription`, `description`, numeric `price`, `duration`, `status`, boolean `available`, `publishedAt` (a MongoDB date or a canonical UTC ISO-8601 string, stored consistently across the collection), and `image`. Services submitted by technicians also have `technicianId`, set from the authenticated session by the server. `serviceMode` is optional; if present, its values are discovered from approved, available services and exposed as the mode-filter options.

The `status` and `available` values are part of the publication contract: only `status: "approved"` and `available: true` may appear in public list, detail, related-service, and API responses.
