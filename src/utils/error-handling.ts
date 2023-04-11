import { ApplicationError } from "@src/models";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

const FB_QUERY_ERROR_STATUSES = [
  "FETCH_ERROR",
  "PARSING_ERROR",
  "TIMEOUT_ERROR",
  "CUSTOM_ERROR",
] as const;

export const isSerializedError = (
  error: FetchBaseQueryError | SerializedError | undefined
): error is SerializedError => {
  return (
    error !== undefined &&
    "name" in error &&
    "message" in error &&
    "stack" in error &&
    "code" in error
  );
};

export const isFetchBaseQueryError = (
  error: FetchBaseQueryError | SerializedError | undefined
): error is FetchBaseQueryError => {
  return (
    error !== undefined &&
    "status" in error &&
    (typeof error.status === "number" ||
      FB_QUERY_ERROR_STATUSES.includes(error.status))
  );
};

export const getMessageFromError = (
  error: FetchBaseQueryError | SerializedError
) => {
  if (isSerializedError(error)) {
    return error.message;
  }

  if (typeof error.status === "number") {
    return (error.data as { error: string }).error;
  }

  return error.error;
};

export const fetchBaseQueryToApplicationError = (
  fbqError: FetchBaseQueryError
): ApplicationError => {
  const originalStatus = fbqError.status;
  const errorMsg = getMessageFromError(fbqError);

  const applicationError = {
    status: "CUSTOM_ERROR",
    error: errorMsg ?? "Something went wrong",
    data: {
      data: fbqError.data,
      status: originalStatus,
      isNotFoundError: originalStatus === 404,
      isValidationError: originalStatus === 422,
      isUnauthorizedError: originalStatus === 403,
      isUnauthenticatedError: originalStatus === 401,
    },
  } as ApplicationError;

  return applicationError;
};
