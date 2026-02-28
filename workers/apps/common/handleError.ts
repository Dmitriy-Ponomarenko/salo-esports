export const handleError = (error: unknown): Response => {
  // Type guard for error object
  const isError = (e: unknown): e is Error => e instanceof Error;
  const hasStatus = (e: unknown): e is { status: number } =>
    typeof e === 'object' && e !== null && 'status' in e;
  const hasCode = (e: unknown): e is { code: number } =>
    typeof e === 'object' && e !== null && 'code' in e;
  const hasMessage = (e: unknown): e is { message: string } =>
    typeof e === 'object' && e !== null && 'message' in e;
  const hasName = (e: unknown): e is { name: string } =>
    typeof e === 'object' && e !== null && 'name' in e;

  // Special handling for validation errors that already have a status code
  const statusCode = hasStatus(error)
    ? error.status
    : hasCode(error)
      ? error.code
      : undefined;
  const statusCodeResult =
    statusCode !== undefined && statusCode >= 200 && statusCode <= 599
      ? statusCode
      : 500;

  if (error !== null && statusCode !== undefined && hasMessage(error)) {
    return new Response(
      JSON.stringify({
        error: hasName(error) ? error.name : 'ValidationError',
        message: error.message,
        status: statusCode,
      }),
      {
        status: statusCodeResult,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Default to 400 for exceptions that appear to be related to validation
  if (
    isError(error) &&
    (error.name.includes('Exception') ||
      error.message.includes('code') ||
      error.message.toLowerCase().includes('validation'))
  ) {
    return new Response(
      JSON.stringify({
        error: error.name || 'ValidationError',
        message: error.message || 'Invalid request data',
        status: 400,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Default to 500 for unhandled errors
  return new Response(
    JSON.stringify({
      error: 'InternalServerError',
      message: 'An internal server error occurred',
      status: 500,
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
