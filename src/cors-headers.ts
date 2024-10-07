/**
 * Adds CORS headers to a Response object.
 *
 * @returns {HeadersInit} An object of CORS headers.
 */
export const addCORSHeaders = (): HeadersInit => ({
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
});
