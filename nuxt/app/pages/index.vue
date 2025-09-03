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
      <li v-for="thing, i of things">{{ thing.title }}</li>
    </ul>

    <!-- <pre>{{ things }}</pre> -->
  </div>
</template>

<script
  setup
  lang="ts"
>
// import { ThingApi } from 'api-client'
import { GaiaApi } from 'api-client'

const TOKEN = "AUTH_TOKEN";

// const baseURL = ""; // if in nuxt we can do this
const baseURL = "http://localhost:3001"; // outside of nuxt 

// const thingApi = new ThingApi({
//   baseURL,
//   // @ts-ignore
//   async onRequest({ request, options }) {
//     options.headers.set('Authorization', `Bearer ${TOKEN}`)
//   }
// });
// const thingApi = useThingApi({ baseURL, TOKEN });
// const thingApi = new GaiaApi({
//   baseUrl: "XX",
//   authorizationToken: "XX"
// })
const api = useGaiaApi();

const page = ref(0);

const fetchThings = async () => {
  things.value = [];

  // const ret = await thingApi.queryArticles(page.value);
  const ret = await api.queryArticles({ adminTags: undefined, sort: undefined, limit: 3 });
  console.log("fetched using thingApi", { ret });

  things.value = ret.things;
}

// this await on the api makes the page suspendable and renders server side, with potentially a loop-back api call
const init = await api.queryArticles({ adminTags: undefined, sort: undefined, limit: 3 });
// console.log("init", init)

const things = ref(init);

// then render client side after hydration
watch(page, fetchThings);

</script>