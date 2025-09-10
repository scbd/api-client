// just to test and get a sense of things

import { ApiBase } from '../api-base'

// A simple API client implementation for testin

export class ThingApi extends ApiBase {
  constructor(opts: any) {
    super({
      // test that handlers can be concatenated
      onRequest: [
        ({ }) => {
          console.log("ThingApi onRequest")
        },
        ({ }) => {
          console.log("ThingApi another onRequest")
        }
      ],
      ...opts,
    });
  }

  async getThings(page?: number) {
    return this.fetch(`/api/things?page=${page || 0}`);
  }
}
