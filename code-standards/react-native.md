# React & React Native

## Components

Use function declarations, not `React.FC` or arrow function assignments.

```ts
// Preferred
export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
    return ( ... );
}

// Avoid
const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    return ( ... );
};
```

## Styling

Use `StyleSheet.create`, co-located at the bottom of the component file. Extract to a separate file only when a component grows complex enough to warrant it.

React Native uses unitless values (density-independent pixels), not CSS units. There is no `rem` or `px` in native code.

## State Management

| State type | Tool |
|-----------|------|
| Server/async state | TanStack Query |
| Local component state | `useState`, `useReducer` |
| Global client state | Add Zustand when a clear cross-component need emerges. Do not pre-add it. |

## Imports

Ordered in three groups, separated by a blank line:

1. React / React Native / Expo
2. Third-party libraries
3. Project imports (`@/`)

```ts
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/src/lib/supabase';
import RestaurantCard from '@/components/RestaurantCard';
import type { Restaurant } from '@/src/types/restaurant';
```

Always use `@/` path aliases. Relative imports (`./`, `../`) only within the same directory.

No barrel exports (`index.ts` re-exports). Import directly from the source file.
