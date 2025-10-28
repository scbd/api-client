import { expect, test } from 'vitest'
import ApiBase from "../src/api-base"
import { handleError } from "../src/api-error"
import CountriesApi from "../src/clients/countries"

test('integration tests with an actual running api', async () => {
  // this is more of an integration test: 
  // make sure the api is running and remove the `return` below to run
  return;

  const baseURL = "https://api.cbddev.xyz";
  const token = "DUMMY_TOKEN"; // auth is actually not required here
  const api = new CountriesApi({ token, baseURL });
  let ret;

  ret = await api.getCountries();
  console.log("all countries", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBeGreaterThan(1);

  ret = await api.getCountries({ query: { code: 'NOPE' } });
  console.log("no countries", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBe(0);

  ret = await api.getCountries({ query: { code: 'CA' } });
  console.log("a country", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBe(1);
  expect(ret[0].name.en).toBe('Canada');

  ret = await api.getCountries({ query: { code: 'CA' }, project: { code: 1, name: 1, "_id": 0 } });
  console.log("a country projected", ret);
  expect(ret).toBeDefined();
  expect(ret.length).toBe(1);
  expect(ret[0].name.en).toBe('Canada');
  expect(Object.keys(ret[0]).length).toBe(2);

  ret = await api.getCountries({ limit: 2 });
  console.log("2 countries", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBe(2);

  ret = await api.getCountries({ limit: 3 });
  console.log("3 countries", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBe(3);

  ret = await api.getCountries({ limit: 3, count: true });
  console.log("3 countries count", ret.length);
  expect(ret).toBeDefined();
  expect(ret.count).toBe(3);

  ret = await api.getCountries({ aggregate: [{ "$sort": { "code": -1 } }] });
  console.log("2 countries aggregated", ret);
  expect(ret).toBeDefined();
  expect(ret[0].code[0]).toBe('Z');

  // empty query, project, sort, aggregate

  ret = await api.getCountries({ query: {} });
  console.log("empty query", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBeGreaterThan(0)

  ret = await api.getCountries({ project: {} });
  console.log("empty query", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBeGreaterThan(0)

  ret = await api.getCountries({ sort: {} });
  console.log("empty query", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBeGreaterThan(0)

  ret = await api.getCountries({ aggregate: [] });
  console.log("empty query", ret.length);
  expect(ret).toBeDefined();
  expect(ret.length).toBeGreaterThan(0)

  // good errors

  expect(api.getCountries({ limit: -1 })).rejects.toThrow("Bad Request");
  
  try {
    ret = await api.getCountries({ limit: -1 });
  } catch (error) {
    console.warn(error);
  }

  // getCountry
    
  ret = await api.getCountry('CA')
  console.log("country", ret);
  expect(ret).toBeDefined();
  expect(ret.name.en).toBe('Canada');

  expect(api.getCountry('NOPE')).rejects.toThrow("Not Found");
});
