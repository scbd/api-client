// TODO remove this example
import ApiBase from '../api-base.js'
import ApiError, { badRequest } from '../api-error.js'

// A simple API client implementation as an example
export default class PokemonApi extends ApiBase {
  constructor(opts: any) {
    super({
      // example interceptor to provide auth token (not actually needed for this api)
      onRequest: ({ options }: { request: any, options: any }) => {
        options.headers = { "Authorization": "Bearer: POKEMONTOKEN" }
      },
      // default base url
      baseURL: "https://pokeapi.co",
      // but can be overridden via opts provided in constructor
      ...opts
    })
  }

  async getPokemons(page?: number) {
    // example basic api error
    if (page == 3) throw new ApiError({ message: "oh nooo!" });

    // standard api error
    if (page && page < -1) throw badRequest("Invalid page");

    // shape request and response (see ofetch's docs)
    const ret = await this.fetch('/api/v2/pokemon', {
      query: {
        limit: 5,
        offset: page || 0,
      }
    });

    return ret.results;
  }
}
