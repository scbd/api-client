import { ApiBase } from './api-base'

export class ThingApi extends ApiBase {
  constructor(opts: any) {
    super(opts);
  }

  async getThings(page?: number) {
    return this.fetch(`/api/things?page=${page || 0}`);
  }
}
