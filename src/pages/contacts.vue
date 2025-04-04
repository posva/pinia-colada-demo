<script lang="ts" setup>
import { searchContacts } from '@/api/contacts'
import { CONTACTS_QUERY_KEYS } from '@/queries/contacts'
import { useQuery } from '@pinia/colada'
import { useRouteQuery } from '@vueuse/router'
import { onErrorCaptured, shallowRef, watch } from 'vue'

const searchText = useRouteQuery('search', '', { mode: 'push' })

const { data: searchResult, isLoading } = useQuery({
  key: () => CONTACTS_QUERY_KEYS.searchWithText(searchText.value),
  query: () => searchContacts(searchText.value),

  // preserve the data from the previous key to display something
  placeholderData: (previousData) => previousData,

  // This avoids the initial flash for an empty search
  // check the differences between placeholderData and initialData in the docs
  initialData: () =>
    !searchText.value
      ? ({
          total: 0,
          results: [],
        } satisfies Awaited<ReturnType<typeof searchContacts>>)
      : undefined,
})
</script>

<template>
  <main class="big-layout">
    <h1 class="mb-12">📇 My Contacts</h1>

    <div class="gap-4 contacts-search md:flex">
      <div>
        <form class="space-x-2" @submit.prevent>
          <label>
            <input
              v-model="searchText"
              autofocus
              :data-loading="isLoading"
              type="search"
              placeholder="Eduardo"
            />
          </label>
        </form>

        <div v-if="searchResult">
          <ul>
            <li v-for="contact in searchResult?.results" :key="contact.id">
              <RouterLink
                :to="{
                  name: '/contacts/[id]',
                  params: { id: contact.id },
                }"
              >
                <img
                  v-if="contact.photoURL"
                  :src="contact.photoURL"
                  class="inline-block w-8 rounded-full"
                />
                {{ contact.firstName }} {{ contact.lastName }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- could also be `v-if="isPending"` -->
        <div v-else>
          <p>Searching...</p>
        </div>
      </div>

      <RouterView />
    </div>
  </main>
</template>

<style scoped>
label:has(input[data-loading='true']) {
  display: block;
  position: relative;
}

label:has(input[data-loading='true'])::before {
  /* display: block; */
  box-sizing: border-box;
  position: absolute;
  content: '';
  top: 50%;
  right: 1em;
  width: 24px;
  height: 24px;
  margin-top: -12px;
  margin-left: -12px;
  border-radius: 50%;
  border-top: 2px solid #07d;
  border-right: 2px solid transparent;
  animation: spinner 600ms linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
