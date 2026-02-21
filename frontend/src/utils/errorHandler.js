export function handleApiError(error) {
  if (error.response && error.response.data?.error) {
    const code = error.response.data.error.code;
    const message = error.response.data.error.message;

    return {
      code,
      message
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Something went wrong"
  };
}