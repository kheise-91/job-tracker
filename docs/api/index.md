---
name: api-documentation
title: API Documentation
description: A list of API endpoints, including expected request examples and response examples.
---

# API Reference

All endpoints return JSON with `Content-Type: application/json`. CORS is enabled for all origins.

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

**Response** — `200 OK`

```json
[
  {
    "id": 1,
    "company": "Acme Corp",
    "position": "Senior Engineer",
    "status": "Applied",
    "date_applied": "2026-05-15 10:30:00",
    "followed_up_date": null,
    "follow_up_dismissed": 0,
    "interview_date": null,
    "source": "LinkedIn",
    "hyperlink": "https://linkedin.com/job/123",
    "notes": "Referred by Jane",
    "updated_at": "2026-05-15 10:30:00",
    "order": 1
  }
]
```

Each job object contains:

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

---

## POST /api/jobs

Create a new job entry.

**Request body**

| Field                | Type    | Required | Default      | Description              |
|----------------------|---------|----------|--------------|--------------------------|
| company              | string  | Yes      | —            | Company name             |
| position             | string  | Yes      | —            | Job title                |
| status               | string  | No       | `"Applied"`  | Initial status           |
| followed_up_date     | string  | No       | `null`       | ISO datetime string      |
| follow_up_dismissed  | boolean | No       | `0`          | Reminder dismissed flag  |
| interview_date       | string  | No       | `null`       | ISO datetime string      |
| source               | string  | No       | `""`         | Where job was found      |
| hyperlink            | string  | No       | `""`         | Link to job posting      |
| notes                | string  | No       | `""`         | Free-form notes          |
| order                | integer | No       | (auto: id)   | Per-column display order |

**Response** — `201 Created`

```json
{
  "id": 2,
  "company": "Acme Corp",
  "position": "Staff Engineer",
  "status": "Applied",
  "date_applied": null,
  "followed_up_date": null,
  "follow_up_dismissed": 0,
  "interview_date": null,
  "source": "LinkedIn",
  "hyperlink": "https://linkedin.com/job/123",
  "notes": "",
  "updated_at": "2026-05-21 12:00:00"
}
```

**Error responses**

- `400` — Missing `company` or `position`:
  ```json
  { "error": "Company and position are required" }
  ```
- `400` — Invalid `status`:
  ```json
  { "error": "Invalid status" }
  ```

---

## PUT /api/jobs/{id}

Partially update an existing job. Only provided fields are updated; `updated_at` is set automatically.

**Path parameter:** `id` (integer)

**Request body** — any subset of:

| Field                | Type    | Description              |
|----------------------|---------|--------------------------|
| company              | string  | New company name         |
| position             | string  | New job title            |
| status               | string  | New status               |
| followed_up_date     | string  | New followed up date     |
| follow_up_dismissed  | boolean | New dismissed flag       |
| interview_date       | string  | New interview date       |
| source               | string  | New source               |
| hyperlink            | string  | New hyperlink            |
| notes                | string  | New notes                |
| order                | integer | New per-column order     |

**Response** — `200 OK` (full updated job object)

```json
{
  "id": 1,
  "company": "Acme Corp",
  "position": "Senior Engineer",
  "status": "Interviewing",
  "date_applied": "2026-05-15 10:30:00",
  "followed_up_date": null,
  "follow_up_dismissed": 0,
  "interview_date": "2026-05-28 14:00:00",
  "source": "LinkedIn",
  "hyperlink": "https://linkedin.com/job/123",
  "notes": "Referred by Jane",
  "updated_at": "2026-05-21 12:00:00"
}
```

**Error responses**

- `400` — No fields provided:
  ```json
  { "error": "No fields to update" }
  ```

---

## PUT /api/jobs/reorder

Bulk-reorder jobs across columns. Accepts an object mapping column IDs (lowercase) to ordered arrays of job IDs.

**Request body**

```json
{
  "columns": {
    "wishlist": [3, 7],
    "applied": [5, 1, 9],
    "interviewing": [2]
  }
}
```

Each key is a lowercase column ID (`wishlist`, `applied`, `followed-up`, `interviewing`, `offer`, `rejected`, `withdrawn`). Each value is an ordered array of job IDs reflecting the desired column order (0-indexed). Unknown column keys are silently ignored.

**Response** — `200 OK`

```json
{ "success": true }
```

**Error responses**

- `400` — Missing or invalid `columns`:
  ```json
  { "error": "Invalid payload" }
  ```
- `500` — Database error (transaction rolled back):
  ```json
  { "error": "<message>" }
  ```

---

## DELETE /api/jobs/{id}

Delete a job entry by ID.

**Path parameter:** `id` (integer)

**Response** — `200 OK`

```json
{ "success": true }
```

---

## Error Handling

Unknown endpoints return `404`:

```json
{ "error": "Endpoint not found" }
```

All error responses use `Content-Type: application/json` and include an `error` key with a human-readable message.
