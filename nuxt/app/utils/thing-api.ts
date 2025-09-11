import { ApiBase } from "api-client"

// A simple API client implementation for testing
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
