import { expect, test } from 'vitest'
import { ApiBase } from "../src/api-base"

// A simple API client implementation for testing
export class ThingApi extends ApiBase {
  constructor(opts: any) {
    super({
      // test that handlers can be concatenated
      onRequest: [
        () => {
          console.log("ThingApi onRequest")
        },
        () => {
          console.log("ThingApi another onRequest")
        }
      ],
      ...opts,
    });
  }

  async getThings(page?: number) {
    return this.fetch(`/api/things?page=${page || 0}`, { onRequest: () => console.log("ThingApi fetch onRequest")});
  }
}

test('integration tests with an actual running api running', async () => {
  // this is more of an integration test: 
  // make sure the api is running and remove the `return` below to run
  return;

  const baseURL = "http://localhost:3001";
  const thingApi = new ThingApi({ baseURL });

  // expect(thingApi.getThings()).resolves;

  let ret = await thingApi.getThings();
  console.log("things", ret);
  expect(ret).toBeDefined();
  expect(ret.things.length).toBe(3);

  ret = await thingApi.getThings(0);
  console.log("things", ret);
  expect(ret).toBeDefined();
  expect(ret.things.length).toBe(3);

  ret = await thingApi.getThings(1);
  console.log("things", ret);
  expect(ret).toBeDefined();
  expect(ret.things.length).toBe(2);
});
