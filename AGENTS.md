# Frontend Project Development Rules

## Project Overview

This is a TypeScript frontend application.

Always follow the existing project architecture and coding style.
Do not create a new structure unless required.

---

# Feature Implementation Workflow

For every new feature, always follow this order:

1. Create TypeScript types
2. Create API service functions
3. Create reusable components
4. Integrate components into pages
5. Test and fix errors

Never skip steps.

---

# Types Rules

- Always create interfaces/types before writing components.
- Put shared types inside the `types` folder.
- Never use `any`.
- Use proper TypeScript types for API responses.

Example:

src/types/review.ts

# API Service Rules

- Never call APIs directly inside components.
- Never use fetch or axios inside components.
- Always use the existing `fetchApi` wrapper.
- All API calls must be inside the `services` folder.

API pattern:

export const featureService = {
getData: async (): Promise<ResponseType> => {
return fetchApi<ResponseType>("/api/example");
},
};

Example:

src/services/
authService.ts
propertyService.ts
reviewService.ts

# Component Rules

- Components must be reusable and separated by responsibility.
- Components should not contain API logic.
- Components should receive data using props or custom hooks.

Example:

src/components/
reviews/
ReviewCard.tsx
ReviewList.tsx

# Page Integration Rules

After creating components:

- Add them to the correct page.
- Follow existing routing structure.
- Do not duplicate UI logic.

Example:

Property Details Page
|
└── ReviewList Component

# API Response Handling

When implementing a feature, the user will provide:

- Feature name
- Endpoint
- API response

Use this information to:

1. Create TypeScript interfaces.
2. Create service functions using fetchApi.
3. Create reusable components.
4. Integrate the feature into the correct pages.

Do not ask for architecture details because they are already defined here.

# Code Quality Rules

- Use TypeScript everywhere.
- Follow existing naming conventions.
- Keep files small and maintainable.
- Avoid duplicated code.
- Reuse existing components and utilities.
- Add loading states.
- Add error handling.
- Handle empty states in UI.

# Folder Structure

Follow this structure:

src/
│
├── app/
│
├── components/
│
├── services/
│
├── types/
│
├── hooks/
│
├── utils/
│
└── lib/

# Naming Rules

## Components

Use PascalCase:

Examples:

PropertyCard.tsx
ReviewList.tsx

## Services

Use camelCase:

Examples:

reviewService.ts
propertyService.ts

## Types

Use feature name:

Examples:

review.ts
property.ts
user.ts

# Feature Request Format

When implementing a new feature, the request will be:

Feature:
(feature name)

Endpoint:
(API endpoint)

Response:
(API response)

Implement the complete feature following all rules above.
