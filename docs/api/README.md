---
name: api-documentation
title: API Documentation
description: A list of API endpoints, including expected request examples and response examples.
---

# API Reference

The ATS exposes a single JSON REST API for CRUD operations on the `jobs` resource. All endpoints return JSON with `Content-Type: application/json`. CORS is enabled for all origins (`Access-Control-Allow-Origin: *`).

## Base URL

```
/api
```

## Status Values

Valid status values across all endpoints:

| Status       | Description                    |
|--------------|--------------------------------|
| Wishlist     | Saved for later consideration  |
| Applied      | Application submitted          |
| Followed Up  | Follow-up completed            |
| Interviewing | Currently in interview process |
| Offer        | Received an offer              |
| Rejected     | Application rejected           |
| Withdrawn    | Self-withdrawn                 |

---

## GET /api/jobs

Return all jobs, ordered by `status` then `order` ascending (per-column ordering).

Supports optional query parameters for filtering. Multiple filters are combined with AND logic.

**Query parameters:**

| Parameter           | Type    | Description                                    |
|---------------------|---------|------------------------------------------------|
| `status`            | string  | Filter by job status (e.g., `Applied`)         |
| `follow_up_dismissed` | boolean-like (`true`/`false`/`1`/`0`) | Filter by reminder dismissed flag |
| `days_ago`          | integer | Only return jobs applied within the last N days |

**Request:** No body. Optional query parameters listed above.

**Response** — `200 OK`

```json
[
  {
    "id": 1,
    "company": "Acme Corp",
    "position": "Backend Engineer",
    "status": "Applied",
    "date_applied": "2026-05-15 10:30:00",
    "followed_up_date": null,
    "follow_up_dismissed": 0,
    "interview_date": null,
    "source": "LinkedIn",
    "hyperlink": "https://acme.com/jobs/123",
    "notes": "Fast response time",
    "order": 0,
    "updated_at": "2026-05-15 10:30:00"
  }
]
```

**Response fields:**

| Field                | Type     | Description                        |
|----------------------|----------|------------------------------------|
| id                   | integer  | Unique identifier                  |
| company              | string   | Company name                       |
| position             | string   | Job title                          |
| status               | string   | Current status                     |
| date_applied         | datetime | Application date                   |
| followed_up_date     | datetime | When user followed up (nullable)   |
| follow_up_dismissed  | boolean  | Reminder dismissed flag (0/1)      |
| interview_date       | datetime | Scheduled interview date (nullable)|
| source               | string   | Where the job was found            |
| hyperlink            | string   | Link to job posting (nullable)     |
| notes                | string   | Free-form notes                    |
| order                | integer  | Per-column display order           |
| updated_at           | datetime | Last update timestamp              |

**Errors:** None expected. Always returns a JSON array (may be empty).

---

## POST /api/jobs

Create a new job entry. Automatically assigns the next available `order` value within the given status bucket. Trims string fields before storage.

**Request body:**

| Field                | Type      | Required | Default     | Description                          |
|----------------------|-----------|----------|-------------|--------------------------------------|
| company              | string    | Yes      | —           | Company name (trimmed)               |
| position             | string    | Yes      | —           | Job title/position (trimmed)         |
| status               | string    | No       | `"Applied"` | One of the valid status values       |
| followed_up_date     | string/null | No     | `null`      | ISO datetime or null                 |
| follow_up_dismissed  | boolean   | No       | `false`     | Normalized to 0/1 integer in storage |
| interview_date       | string/null | No     | `null`      | ISO datetime or null                 |
| source               | string    | No       | `""`        | Where the job was found (trimmed)    |
| hyperlink            | string    | No       | `""`        | URL to job posting (trimmed)         |
| notes                | string    | No       | `""`        | Free-form notes (trimmed)            |

**Response** — `201 Created`

```json
{
  "id": 2,
  "company": "Acme Corp",
  "position": "Senior Developer",
  "status": "Wishlist",
  "date_applied": "2026-05-30 12:00:00",
  "followed_up_date": null,
  "follow_up_dismissed": 0,
  "interview_date": null,
  "source": "",
  "hyperlink": "",
  "notes": "",
  "order": 3,
  "updated_at": "2026-05-30 12:00:00"
}
```

**Errors:**

| Code | Meaning                                     |
|------|---------------------------------------------|
| 400  | `company` and/or `position` is missing or empty, or `status` is not in the allowed list |

---

## PUT /api/jobs/{id}

Partially update a single job. Only fields present in the request body are updated. The `updated_at` timestamp is always refreshed. Trims string fields before storage. Accepts flexible types for `follow_up_dismissed` (booleans, strings `"true"`/`"false"`, `"1"`/`"0"`).

**Path parameter:** `{id}` — integer job ID from path `/api/jobs/123`.

**Request body** — all fields optional, any combination:

| Field                | Type      | Description                                |
|----------------------|-----------|--------------------------------------------|
| company              | string    | Trimmed before storage                     |
| position             | string    | Trimmed before storage                     |
| status               | string    | Must be one of the allowed statuses        |
| followed_up_date     | string/null | Set to `null` if empty string or null    |
| follow_up_dismissed  | boolean   | Normalized to 0/1                          |
| interview_date       | string/null | Set to `null` if empty string or null    |
| notes                | string    | Free-form notes                            |
| source               | string    | Source of the job listing                  |
| hyperlink            | string    | URL to job posting                         |

**Response** — `200 OK` (full updated job object)

```json
{
  "id": 1,
  "company": "Acme Corp",
  "position": "Backend Engineer",
  "status": "Interviewing",
  "date_applied": "2026-05-15 10:30:00",
  "followed_up_date": "2026-05-22 09:00:00",
  "follow_up_dismissed": 0,
  "interview_date": "2026-05-28 14:00:00",
  "source": "LinkedIn",
  "hyperlink": "https://acme.com/jobs/123",
  "notes": "Technical round next week",
  "order": 0,
  "updated_at": "2026-05-30 15:00:00"
}
```

**Errors:**

| Code | Meaning                                    |
|------|--------------------------------------------|
| 400  | No fields provided in body, or `status` is not in the allowed list |

---

## PUT /api/jobs/reorder

Bulk-update status and order for multiple jobs at once. Accepts a map of column IDs (lowercase kebab-case) to arrays of job IDs. Uses a database transaction — rolls back on failure.

**Request body:**

```json
{
  "columns": {
    "applied": [5, 3, 7],
    "interviewing": [12]
  }
}
```

Valid column keys: `wishlist`, `applied`, `followed-up`, `interviewing`, `offer`, `rejected`, `withdrawn`. Unknown keys are silently ignored.

**Response** — `200 OK`

```json
{ "success": true }
```

**Errors:**

| Code | Meaning                                           |
|------|---------------------------------------------------|
| 400  | `columns` is missing or not an array              |
| 500  | Database error (transaction rolled back); response body contains the exception message |

---

## DELETE /api/jobs/{id}

Permanently delete a job by its ID. No body required. If the job doesn't exist, DELETE still returns 200 with `success: true` (SQLite DELETE is silent on no-match).

**Path parameter:** `{id}` — integer job ID from path `/api/jobs/123`.

**Response** — `200 OK`

```json
{ "success": true }
```

**Errors:** None explicitly handled.

---

## Common behavior

| Aspect       | Detail                                                        |
|--------------|---------------------------------------------------------------|
| CORS         | `Access-Control-Allow-Origin: *`; allows GET, POST, PUT, DELETE, OPTIONS |
| Content-Type | `application/json` on all responses                           |
| 404 fallback | Any unmatched route returns `{ "error": "Endpoint not found" }` with status 404 |
| Auth         | None — no authentication or authorization is implemented      |
