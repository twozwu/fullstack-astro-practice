import type { APIRoute } from "astro";

export const all: APIRoute = async (ctx) => {
  const method = ctx.request.method;

  return {
    body: JSON.stringify({
      method,
      message: "Unsupported HTTP method",
    }),
    status: 501,
  };
};

// nanoid will be used to generate unique IDs
import { nanoid } from "nanoid";
import { TOKEN } from "@constants/cookies";
import { getAuth } from "firebase-admin/auth";
import { BUCKET_NAME } from "@constants/firebase";
import { getStorage } from "firebase-admin/storage";
import { serverApp } from "@scripts/firebase/initServer";

// get firebase server auth module
const auth = getAuth(serverApp);

export const post: APIRoute = async (ctx) => {
  // Create an error response
  const authUserError = new Response("Unauthenticated user", { status: 401 });

  try {
    // Get token cookie
    const authToken = ctx.cookies.get(TOKEN).value;

    // not present, return error response
    if (!authToken) {
      return authUserError;
    }

    // verify the user token
    await auth.verifyIdToken(authToken);
  } catch (error) {
    /**
     * Return error response, e.g.,
     * if the token verification fails
     */
    return authUserError;
  }

  try {
    // Get the audio blob from the client request
    const blob = await ctx.request.blob();

    // Get access to the firebase storage
    const storage = getStorage(serverApp);
    const bucket = storage.bucket(BUCKET_NAME);

    // convert Blob to native Node Buffer for server storage
    const buffer = Buffer.from(await blob.arrayBuffer());
    const file = bucket.file(`recording-${nanoid()}.wav`);

    // save to firebase storage
    await file.save(buffer);

    // return a successful response
    return {
      body: JSON.stringify({
        message: "Recording uploaded",
      }),
    };
  } catch (error) {
    console.error(error);
    return new Response("Something went horribly wrong", { status: 500 });
  }
};