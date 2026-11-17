export function getAuthErrorMessage(error: unknown, fallback: string) {
  let message = "";
  let status: number | undefined;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "object" && error !== null) {
    const details = error as { message?: unknown; status?: unknown; statusCode?: unknown };
    if (typeof details.message === "string") message = details.message;
    if (typeof details.status === "number") status = details.status;
    if (typeof details.statusCode === "number") status = details.statusCode;
  }

  const normalized = message.toLowerCase();
  if (/already exists|already registered|duplicate|email.+taken/.test(normalized)) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (/invalid.+(credential|password|email)|incorrect.+(password|email)|wrong password/.test(normalized)) {
    return "The email or password is incorrect.";
  }
  if (status !== undefined && status >= 500) return fallback;

  return message || fallback;
}
