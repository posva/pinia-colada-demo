export const CONTACTS_QUERY_KEYS = {
  root: ['contacts'],
  byId: (id: string) => CONTACTS_QUERY_KEYS.root.concat(id),
  search: () => CONTACTS_QUERY_KEYS.root.concat('search'),
  searchWithText: (searchText: string) => CONTACTS_QUERY_KEYS.search().concat(searchText),
}
