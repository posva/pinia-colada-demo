<script lang="ts" setup>
import { useRoute } from 'vue-router/auto'
import ContactCard from '@/components/ContactCard.vue'
import {
  updateContact as _updateContact,
  getContactById,
  patchContact,
  type ContactSearchResults,
  type Contact,
} from '@/api/contacts'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { CONTACTS_QUERY_KEYS } from '@/queries/contacts'

const route = useRoute('/contacts/[id]')
const queryCache = useQueryCache()

const { mutate: updateContact, error } = useMutation({
  mutation: patchContact,

  onMutate: (contactData) => {
    // optimistically update the cache for the current contact
    const oldContact = queryCache.getQueryData<Contact>(
      CONTACTS_QUERY_KEYS.byId(String(contactData.id)),
    )!
    const newContact = { ...oldContact, ...contactData }
    queryCache.setQueryData<Contact>(CONTACTS_QUERY_KEYS.byId(String(newContact.id)), newContact)

    // optimistically update the cache for all the search results
    const searchResultEntries = queryCache.getEntries({
      key: CONTACTS_QUERY_KEYS.search(),
    })!

    const oldSearchResults = new Map<string, ContactSearchResults>()
    const newSearchResults = new Map<string, ContactSearchResults>()
    for (const entry of searchResultEntries) {
      const searchResults = entry.state.value.data as ContactSearchResults
      // store the old search results
      oldSearchResults.set(entry.key.join('/'), searchResults)
      const data = {
        ...searchResults,
        // create a copy of the array with the new contact
        results: searchResults.results.map((contact) => {
          if (contact.id === contactData.id) {
            return newContact
          }
          return contact
        }),
      } satisfies ContactSearchResults
      newSearchResults.set(entry.key.join('/'), data)
      queryCache.setEntryState(entry, {
        error: null,
        status: 'success',
        data,
      })
    }

    return { newContact, oldContact, oldSearchResults, newSearchResults }
  },

  onError: (error, contactData, { newContact, oldContact, newSearchResults, oldSearchResults }) => {
    if (!newContact) return // onMutate failed
    // rollback the optimistic update of the contact
    if (newContact === queryCache.getQueryData(CONTACTS_QUERY_KEYS.byId(String(newContact.id)))) {
      queryCache.setQueryData(CONTACTS_QUERY_KEYS.byId(String(newContact.id)), oldContact)
    }

    // rollback the optimistic update of all the search results
    for (const [key, searchResults] of newSearchResults) {
      const entry = queryCache.getEntries({ key: key.split('/'), exact: true })[0]
      // skip if the entry is not the same we changed
      if (!entry || entry.state.value.data !== searchResults) continue // entry not found

      queryCache.setEntryState(entry, {
        error: null,
        status: 'success',
        data: oldSearchResults.get(key),
      })
    }
  },

  onSettled(data, error, vars) {
    queryCache.invalidateQueries({ key: CONTACTS_QUERY_KEYS.byId(String(vars.id)) })
    queryCache.invalidateQueries({ key: CONTACTS_QUERY_KEYS.search() })
  },
})

const { data: contact } = useQuery({
  key: () => CONTACTS_QUERY_KEYS.byId(route.params.id),
  query: () => getContactById(route.params.id),
})
</script>

<template>
  <section class="flex-grow pt-6 md:pt-0">
    <ContactCard
      v-if="contact"
      :key="contact.id"
      :contact="contact"
      @update:contact="updateContact"
    />
    <div v-else>Loading...</div>
  </section>
</template>
