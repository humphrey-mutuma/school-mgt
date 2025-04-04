export const students = [{ id: 1, name: "Jane" }];

export async function extractUsernameFromToken(token) {
  try {
    // Split the JWT and decode the payload
    const payloadBase64 = token.split(".")[1]; // JWT format: header.payload.signature
    const payloadDecoded = JSON.parse(atob(payloadBase64)); // Decode Base64 to JSON

    // Return the username if it exists
    return payloadDecoded.username || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
