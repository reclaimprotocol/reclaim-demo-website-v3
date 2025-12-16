export const getErrorMessage = (error: any) => {
  return typeof error === "object" && error && "message" in error
    ? error.message
    : error;
};
