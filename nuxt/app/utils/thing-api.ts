import ApiBase from 'api-client'

// A simple API client implementation for testing
export class ThingApi extends ApiBase {
  constructor(opts: any) {
    super({
      // test that handlers can be concatenated
      onRequest: [
        ({ options }: { request: any, options: any }) => {
          options.headers = { "Authorization": "Bearer: TOKEN" }
        },
      ],
      // baseURL: , 
      ...opts
    })
  }

  async getThings(page?: number) {
    return this.fetch(`/api/things?page=${page || 0}`)
  }
}
