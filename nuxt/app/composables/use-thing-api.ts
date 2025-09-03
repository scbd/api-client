import { ThingApi } from 'api-client'

export const useThingApi = ({ baseURL, TOKEN }: any) => {

  const thingApi = new ThingApi({
    baseURL,
    // @ts-ignore
    async onRequest({ request, options }) {
      options.headers.set('Authorization', `Bearer ${TOKEN}`)
    }
  });

  return thingApi;
}
