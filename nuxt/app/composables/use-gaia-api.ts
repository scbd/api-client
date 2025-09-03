import { GaiaApi } from 'api-client'

export const useGaiaApi = () => {
  const { token } = useScbdAuth();
  const { gaiaApiUrl: baseUrl } = useRuntimeConfig().public;

  const gaiaApi = new GaiaApi({
    baseUrl,
    authorizationToken: token,
  });

  return gaiaApi;
}
