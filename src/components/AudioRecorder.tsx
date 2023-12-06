// 📂 src/components/AudioRecorder.tsx

/**
 * The useStore hook will help with the React
 * component rerenders. In simple terms, it'll hook into the
 * store and react upon any change.
 */
import { useStore } from "@nanostores/react";
import { VoiceRecorder } from "react-voice-recorder-player";
// Import the store and the upload recording action
import { $audioRecording, uploadRecording } from "@stores/audioRecording";

type Props = {
  cta?: string;
};

export const Recorder = (props: Props) => {
  // Get the current application state from the store
  const state = useStore($audioRecording);

  // React deterministically based on the status of the store
  switch (state.status) {
    case "idle":
      return (
        <div>
          <VoiceRecorder
            // 👀 Invoke uploadRecording after a user completes the recording
            onAudioDownload={(blob: Blob) => uploadRecording(blob)}
          />

          {props.cta}
        </div>
      );
    /** 
 Show relevant UI during the uploading state. 
**/
    case "uploading":
      return (
        <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
            Uploading ...
          </div>
        </div>
      );
    /** 
 Show relevant UI during the failed state. 
**/
    case "failed":
      return (
        <div className="bg-red-400 rounded-md py-6 px-3 text-slate-100 motion-safe:animate-bounce">
          An error occurred uploading your recording
        </div>
      );
    /** 
 Show relevant UI during the completed state. 
**/
    case "completed":
      return (
        <div className="bg-green-400 rounded-md py-6 px-3 text-slate-100 motion-safe:animate-bounce">
          Successfully published your recording!
        </div>
      );
    /** 
 Typescript exhaustive checking
 @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
**/

    default:
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
  }
};
