# Pinia Colada mini workshop

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

## Exercises

- Add Pinia Colada Vue Plugin
- Migrate contacts details to use Pinia Colada `useQuery()`
  - Keys should be reusable
  - play around with `staleTime` and `gcTime`
  - Display the loading state only if the data is not available
- Migrate the contact update to use Pinia Colada `useMutation()`
  - Invalidate the contact and see how it automatically updates
  - Add an optimistic update to the contact
  - Play around with `staleTime`, changing multiple contacts and see which ones are fetched again
  - Show a subtle loading state when the mutation is in progress
  - Display an error if the mutation fails (change the `api/contacts.ts` to add errors)
- Migrate the contact search to use Pinia Colada `useQuery()`
  - Ensure keys are hierarchical (contacts -> search | contacts -> id)
- Update the contact update contact to also invalidate the search results
- Extra
  - Debounce the search

## Resources

- [Pinia Colada](https://pinia-colada.esm.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Water.css](https://watercss.kognise.dev/)
