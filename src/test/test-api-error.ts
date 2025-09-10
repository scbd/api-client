import { ApiError } from "../api-error"

// hint: run as `node --watch ./dist/test/test-api-error` 
// with simultaneously `yarn tsc --watch` in another terminal

async function testErrors() {
  // console.log("test", new ApiError({}));
  // console.log("test forbidden", ApiError.forbidden());
  // console.log("test badRequest", ApiError.badRequest());

  // console.log("test isBadRequest", ApiError.isBadRequest(ApiError.badRequest()));
  // console.log("test isUnauthorized", ApiError.isUnauthorized(ApiError.unauthorized()));
  // console.log("test isForbidden", ApiError.isForbidden(ApiError.forbidden()));
  // console.log("test isNotFound", ApiError.isNotFound(ApiError.notFound()));

  console.log("test getStatusCode badRequest (expect 400)", ApiError.getStatusCode(new ApiError({ code: "badRequest" })));
  console.log("test getStatusCode mandatory (expect 400)", ApiError.getStatusCode(new ApiError({ code: "mandatory" })));
  console.log("test getStatusCode invalidParameter (expect 400)", ApiError.getStatusCode(new ApiError({ code: "invalidParameter" })));

  console.log("test getStatusCode unauthorized (expect 401)", ApiError.getStatusCode(new ApiError({ code: "unauthorized" })));
  console.log("test getStatusCode forbidden (expect 403)", ApiError.getStatusCode(new ApiError({ code: "forbidden" })));
  console.log("test getStatusCode notFound (expect 404)", ApiError.getStatusCode(new ApiError({ code: "notFound" })));
  console.log("test getStatusCode internalServerError (expect 500)", ApiError.getStatusCode(new ApiError({ code: "internalServerError" })));
  console.log("test getStatusCode notImplemented (expect 501)", ApiError.getStatusCode(new ApiError({ code: "notImplemented" })));
  console.log("test getStatusCode serviceUnavailable (expect 503)", ApiError.getStatusCode(new ApiError({ code: "serviceUnavailable" })));
  console.log("test getStatusCode gibberish (expect 500)", ApiError.getStatusCode(new ApiError({ code: "gibberish" })));

  console.log("test statusCode 404 (expect notFound)", new ApiError({ statusCode: 404 }).code);
  console.log("test statusCode 418 (expect imATeapot)", new ApiError({ statusCode: 418 }).code);
  console.log("test statusCode 500 (expect internalServerError)", new ApiError({ statusCode: 500 }).code);
  console.log("test statusCode 123 (expect internalServerError)", new ApiError({ statusCode: 123 }).code);

  console.log("test code Not Found (expect statusCode 404)", new ApiError({ code: "Not Found" }).statusCode);
  console.log("test code Method Not Allowed (expect statusCode 405)", new ApiError({ code: "Method Not Allowed" }).statusCode);
}

testErrors();
