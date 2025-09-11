import { expect, test } from 'vitest'
import { ApiError } from "../src/api-error"

test('Test constructors', () => {
  expect(new ApiError({}).statusCode).toBe(500);
  expect(new ApiError({ statusCode: 418 }).statusCode).toBe(418);
  expect(ApiError.forbidden().code).toBe("forbidden");
  expect(ApiError.badRequest().code).toBe("badRequest");
});

test('isBadRequest, isAuthorized, etc', () => {
  expect(ApiError.isBadRequest(ApiError.badRequest())).toBeTruthy();
  expect(ApiError.isUnauthorized(ApiError.unauthorized())).toBeTruthy();
  expect(ApiError.isForbidden(ApiError.forbidden())).toBeTruthy();
  expect(ApiError.isNotFound(ApiError.notFound())).toBeTruthy();
});

test('getStatusCode matches expected custom error codes', () => {
  expect(ApiError.getStatusCode(new ApiError({ code: "badRequest" }))).toBe(400);
  expect(ApiError.getStatusCode(new ApiError({ code: "mandatory" }))).toBe(400);
  expect(ApiError.getStatusCode(new ApiError({ code: "invalidParameter" }))).toBe(400);
});

test('getStatusCode matches expected standard error code', () => {
  expect(ApiError.getStatusCode(new ApiError({ code: "unauthorized" }))).toBe(401);
  expect(ApiError.getStatusCode(new ApiError({ code: "forbidden" }))).toBe(403);
  expect(ApiError.getStatusCode(new ApiError({ code: "notFound" }))).toBe(404);
  expect(ApiError.getStatusCode(new ApiError({ code: "internalServerError" }))).toBe(500);
  expect(ApiError.getStatusCode(new ApiError({ code: "notImplemented" }))).toBe(501);
  expect(ApiError.getStatusCode(new ApiError({ code: "serviceUnavailable" }))).toBe(503);
  expect(ApiError.getStatusCode(new ApiError({ code: "gibberish" }))).toBe(500);
});

test('code matches provided statusCode', () => {
  expect(new ApiError({ statusCode: 404 }).code).toBe("notFound");
  expect(new ApiError({ statusCode: 418 }).code).toBe("iMATeapot");
  expect(new ApiError({ statusCode: 500 }).code).toBe("internalServerError");
  expect(new ApiError({ statusCode: 123 }).code).toBe("internalServerError");

});

test('status code matches code with long name', () => {
  expect(new ApiError({ code: "Not Found" }).statusCode).toBe(404);
  expect(new ApiError({ code: "Method Not Allowed" }).statusCode).toBe(405);
});
