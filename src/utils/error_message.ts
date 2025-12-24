// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any) => {
  return typeof error === "object" && error && "message" in error
    ? error.message
    : error;
};
