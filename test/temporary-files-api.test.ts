import { expect, test } from 'vitest'
import TemporaryFilesApi, { getMimeType } from "../src/clients/temporary-files"
import ApiError from '../src/api-error';

const createFile = (fileName: string, content: string, fileType?: string) => {
  const blob = new Blob([content], { type: fileType });
  const file = new File([blob], fileName, { type: fileType });

  // console.log(file);
  return file;
}

test('that getMimeType works as expected', async () => {

  let file;

  file = createFile("foobar.json", `{"Hello": "World!"}`);

  expect(file).toBeDefined();
  expect(file.name).toBe('foobar.json');

  expect(getMimeType(file)).toBe("application/json");

  file = createFile("foobar.geojson", `{"Hello": "World!"}`);
  expect(getMimeType(file)).toBe("application/json");

  file = createFile("foobar.car", `{"Hello": "Car!"}`);
  expect(getMimeType(file)).toBe("application/octet-stream");

  file = createFile("foobar.car", `{"Hello": "Dar!"}`, "text");
  expect(getMimeType(file)).toBe("text");

  file = createFile("foobar.xml", "<foo><bar /></foo>");
  expect(getMimeType(file)).toBe("application/xml");

  file = createFile("foobar.xml", "<foo><bar /></foo>", "application/octet-stream");
  expect(getMimeType(file)).toBe("application/xml");

  file = createFile("foobar.xml", "<foo><bar /></foo>", "foo/bar");
  expect(getMimeType(file)).toBe("foo/bar");
});
 
test('integration tests with an actual running api', async () => {
  // this is more of an integration test: 
  // make sure the api is running and remove the `return` below to run
  return;

  const baseURL = "https://api.cbddev.xyz";
  let token = "DUMMY_TOKEN";
  let api = new TemporaryFilesApi({ token, baseURL });
  let ret;
  let file;

  file = createFile("foobar.json", `{" foo": "BAR" }`, 'application/json');

  await expect(api.get('BADFORMAT')).rejects.toThrowError(ApiError); // bad request
  await expect(api.get("0123456789abcdef0123456789abcdef")).rejects.toThrowError(ApiError); // not found
  await expect(api.upload(file)).rejects.toThrowError(ApiError); // auth

  // NOTE: grab a fresh token
  token = "Bearer REAL_TOKEN_HERE";
  api = new TemporaryFilesApi({ token, baseURL });

  ret = await api.upload(file);
  console.log("upload json file", { file, ret });
  expect(ret).toBeDefined();
  expect(ret?.uid).toBeDefined();
  expect(ret?.url).toBeDefined();
  expect(ret?.url).toMatch(/https?:\/\//);

  file = createFile("foobar.xml", "<foo><bar /></foo>", "text/xml")
  ret = await api.upload(file, { foo: "BAR" });
  console.log("upload xml file", { file, ret });
  expect(ret).toBeDefined();
  expect(ret?.uid).toBeDefined();
  expect(ret?.url).toBeDefined();
  expect(ret?.url).toMatch(/https?:\/\//);
  expect(ret?.metadata?.foo).toBe("BAR");

  ret = await api.get(ret?.uid);
  console.log("get xml file", { file, ret });
  expect(ret).toBeDefined();
  expect(ret?.uid).toBeDefined();
  expect(ret?.url).toBeDefined();
  expect(ret?.url).toMatch(/https?:\/\//);
  expect(ret?.metadata?.foo).toBe("BAR");
});
