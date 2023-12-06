// 📂 src/stores/audioRecording.ts
import { atom } from "nanostores";

/**
 * Deterministic state representation
 */
type Store =
  | {
      blob: null;
      status: "idle";
    }
  | {
      blob: Blob;
      status: "uploading" | "completed" | "failed";
    };

/**
 * Optional naming convention: $[name_of_store]
 * instead of [name_of_store]Store
 *, i.e., $audioRecording instead of audioRecordingStore
 */
export const $audioRecording = atom<Store>({
  // Initialise the atom with the default state
  blob: null,
  status: "idle",
});

/**
 * upload audio recording action
 */
export const uploadRecording = async (blob: Blob) => {
  // Update $audioRecording state to "uploading."
  $audioRecording.set({
    status: "uploading",
    blob,
  });

  try {
    // POST request to our recording endpoint
    const response = await fetch("/api/recording", {
      method: "POST",
      body: blob, // pass blob as the request body
    });

    if (response.ok) {
      // Successful? Update state to "completed."
      $audioRecording.set({
        status: "completed",
        blob,
      });
    } else {
      // Request failed. Update state to "failed."
      $audioRecording.set({
        status: "failed",
        blob,
      });
    }
  } catch (error) {
    $audioRecording.set({
      status: "failed",
      blob,
    });
  } finally {
    // after 't' revert state to idle again
    const timeout = 3000;
    setTimeout(() => {
      $audioRecording.set({
        status: "idle",
        blob: null,
      });
    }, timeout);
  }
};
