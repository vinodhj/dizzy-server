export function addCORSHeaders(): { [key: string]: string } {
    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };
  }