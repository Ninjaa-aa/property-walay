---
project: PropertyWalay
---

## Anti-hallucination workflow

1. Find the contract first.
   - Backend: `backend/app/schemas/<module>/` and the code paths reading those schemas.
   - Frontend: `frontend/types/<module>/` + `frontend/lib/api/<module>.ts`.
2. Update the contract, then implement the behavior to match it.
3. Add a small contract test for the behavior/shape (PPT slides, API responses, etc.).
4. Never create duplicate entrypoints. Search the repo before adding a new `routes/*_exports.py`-style file.

