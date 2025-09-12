import { expect, test } from 'vitest'
import ApiError, { forbidden, badRequest, isBadRequest, isUnauthorized, unauthorized, isForbidden, isNotFound, notFound, extractStatusCode,  } from "../src/api-error"

test('Test constructor and factory functions', () => {
  expect(new ApiError({}).statusCode).toBe(500);
  expect(new ApiError({ statusCode: 418 }).statusCode).toBe(418);
  expect(forbidden().code).toBe("forbidden");
  expect(badRequest().code).toBe("badRequest");
});

test('isBadRequest, isAuthorized, etc', () => {
  expect(isBadRequest(badRequest())).toBeTruthy();
  expect(isUnauthorized(unauthorized())).toBeTruthy();
  expect(isForbidden(forbidden())).toBeTruthy();
  expect(isNotFound(notFound())).toBeTruthy();
});

test('getStatusCode matches expected custom error codes', () => {
  expect(extractStatusCode(new ApiError({ code: "badRequest" }))).toBe(400);
  expect(extractStatusCode(new ApiError({ code: "mandatory" }))).toBe(400);
  expect(extractStatusCode(new ApiError({ code: "invalidParameter" }))).toBe(400);
});

test('extractStatusCode matches expected standard error code', () => {
  expect(extractStatusCode(new ApiError({ code: "unauthorized" }))).toBe(401);
  expect(extractStatusCode(new ApiError({ code: "forbidden" }))).toBe(403);
  expect(extractStatusCode(new ApiError({ code: "notFound" }))).toBe(404);
  expect(extractStatusCode(new ApiError({ code: "internalServerError" }))).toBe(500);
  expect(extractStatusCode(new ApiError({ code: "notImplemented" }))).toBe(501);
  expect(extractStatusCode(new ApiError({ code: "serviceUnavailable" }))).toBe(503);
  expect(extractStatusCode(new ApiError({ code: "gibberish" }))).toBe(500);
});

test('code matches provided statusCode', () => {
  expect(new ApiError({ statusCode: 404 }).code).toBe("notFound");
  expect(new ApiError({ statusCode: 418 }).code).toBe("imATeapot");
  expect(new ApiError({ statusCode: 500 }).code).toBe("internalServerError");
  expect(new ApiError({ statusCode: 123 }).code).toBe("internalServerError");

});

test('status code matches code with long name', () => {
  expect(new ApiError({ code: "Not Found" }).statusCode).toBe(404);
  expect(new ApiError({ code: "Method Not Allowed" }).statusCode).toBe(405);
});
