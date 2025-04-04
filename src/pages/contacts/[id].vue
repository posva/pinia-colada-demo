<script lang="ts" setup>
import { useRoute } from 'vue-router/auto'
import ContactCard from '@/components/ContactCard.vue'
import { updateContact as _updateContact, getContactById, patchContact } from '@/api/contacts'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { CONTACTS_QUERY_KEYS } from '@/queries/contacts'

const route = useRoute('/contacts/[id]')
const queryCache = useQueryCache()

const { mutate: updateContact, error } = useMutation({
  mutation: patchContact,

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
