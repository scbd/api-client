import { expect, test } from 'vitest'
import TemporaryFilesApi, { getMimeType } from "../src/clients/temporary-files"

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

  expect(api.get('BADFORMAT')).rejects.toThrow("Id format is invalid"); // maybe should be Bad Request?
  expect(api.upload(file)).rejects.toThrow("authorization_required");

  // NOTE: grab a fresh token
  token = "Bearer 0ABA909B334BA8A10407D551A538020AF73B23A1F3A747E416B336B94F085FD9D43AE2BAF07601D83A583469940CAD1EFACE18C87BF00469A0D3C8D759F875390290BEF9D18D5841BA1BD0F94168B46014D7F9693FA06E03C7DD43539E5EAAE0981F25AB49D36D4DBB9AA5A0D12C8AF04E24A32FFB7E7EF532E1EC235AEE5D88BB7DFDA394F24D97CF49A54D96B60553FB86AD19E0BB622CEDCCDB443E065AE8CF82E9897789D6B7249676DCBE9F18E7";
  api = new TemporaryFilesApi({ token, baseURL });

  ret = await api.upload(file);
  expect(ret).toBeDefined();
  expect(ret.uid).toBeDefined();
  expect(ret.url).toBeDefined();
  expect(ret.url).toMatch(/https?:\/\//);

  file = createFile("foobar.xml", "<foo><bar /></foo>", "text/xml")
  ret = await api.upload(file, { foo: "BAR" });
  expect(ret).toBeDefined();
  expect(ret.uid).toBeDefined();
  expect(ret.url).toBeDefined();
  expect(ret.url).toMatch(/https?:\/\//);
  expect(ret.metadata.foo).toBe("BAR");

  ret = await api.get(ret.uid);
  expect(ret).toBeDefined();
  expect(ret.uid).toBeDefined();
  expect(ret.url).toBeDefined();
  expect(ret.url).toMatch(/https?:\/\//);
  expect(ret.metadata.foo).toBe("BAR");
});
