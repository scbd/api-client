<template>
  <div>
    <h1>things</h1>
    <h3>
      <a
        @click="fetchThings"
        href="#"
      >
        [fetch again]
      </a>
    </h3>
    <h3>
      page {{ page }}
      <a
        @click="page--"
        href="#"
      >
        [prev]
      </a>
      <a
        @click="page++"
        href="#"
      >
        [next]
      </a>
    </h3>

    <h3>things</h3>
    <ul>
      <li v-for="thing, i of things">{{ thing.name }}</li>
    </ul>

    <!-- <h3>json</h3>
    <pre>{{ things }}</pre> -->
  </div>
</template>

<script
  setup
  lang="ts"
>
import { ref, watch } from 'vue';
import { ThingApi } from '../utils/thing-api';

const api = new ThingApi({ baseURL: "http://localhost:3001" });

const page = ref(0);

const fetchThings = async () => {
  things.value = [];

  const ret = await api.getThings(page.value);
  console.log("fetched using thingApi", { ret });

  things.value = ret.things;
}

const init = await api.getThings(page.value);
const things = ref(init.things);

watch(page, fetchThings);
</script>