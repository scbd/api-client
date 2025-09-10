import { ApiError } from "../api-error"
import { ThingApi } from "./thing-api"

// hint: run as `node --watch ./dist/test/test-thing-api` 
// with simultaneously `yarn tsc --watch` in another terminal

async function testThing() {
  const baseURL = "http://localhost:3001";
  const thingApi = new ThingApi({ baseURL });

  try {
    console.log("test things", JSON.stringify(await thingApi.getThings()));
    console.log("test things page 0", JSON.stringify(await thingApi.getThings(0)));
    console.log("test things page 1", JSON.stringify(await thingApi.getThings(1)));
    console.log("test things page 2", JSON.stringify(await thingApi.getThings(2)));
  } catch (error: any) {
    console.error("Error!", { error_str: JSON.stringify(error), ...error });
  }
}

async function testErrors() {
  console.log("test forbidden", ApiError.forbidden());
  console.log("test badRequest", ApiError.badRequest());
  console.log("test getStatusCode", ApiError.getStatusCode(ApiError.forbidden()));
  console.log("test isBadRequest", ApiError.isBadRequest(ApiError.badRequest()));
}

testThing();
testErrors();
