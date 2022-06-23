<template>
  <q-page class="flex flex-center">
    <v-todo-table />
  </q-page>
</template>

<script>
import {defineComponent} from 'vue';
import TodoTable from 'components/TodoTable'

export default defineComponent({
  name: 'PageIndex',
  components: {
    "v-todo-table": TodoTable,
  },
  data() {
    return {

    }
  },
  created() {

  },
  computed: {

  },
  methods: {

  }
})
</script>
