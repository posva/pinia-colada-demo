<script lang="ts" setup>
import { useRoute } from 'vue-router/auto'
import ContactCard from '@/components/ContactCard.vue'
import { updateContact as _updateContact, getContactById } from '@/api/contacts'
import type { Contact } from '@/api/contacts'
import { shallowRef, watch } from 'vue'

const route = useRoute('/contacts/[id]')

function updateContact(contact: Partial<Contact> & { id: number }) {
  return _updateContact({ ...contact, id: contact.id })
}

const contact = shallowRef<Contact>()
watch(
  () => route.params.id,
  async (id) => {
    contact.value = await getContactById(id)
  },
  { immediate: true },
)
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
