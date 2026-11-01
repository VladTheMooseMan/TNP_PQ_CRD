// ============================================================
// FILE: src/lib/audio_ambience.ts
// PURPOSE: Looped ambient soundscape controller.
// ------------------------------------------------------------
// ASCII FLOW:
//   start_ambience_loop -> HTMLAudio.loop=true -> play
//      -> returns stop fn
// ============================================================
const ambient_track_relative_path = "assets/audio/ambience_dark_woods.mp3";

export function start_ambience_loop(): () => void {
  console.log("[DEBUG][audio_ambience] start_ambience_loop");
  const ambient_audio_element = new Audio(`${import.meta.env.BASE_URL}${ambient_track_relative_path}`);
  ambient_audio_element.loop = true;
  ambient_audio_element.volume = 0.25;
  const playback_promise = ambient_audio_element.play().catch((autoplay_blocked_error) => {
    console.log("[DEBUG][audio_ambience] autoplay blocked:", autoplay_blocked_error.message);
  });
  void playback_promise;
  return () => {
    console.log("[DEBUG][audio_ambience] stop_ambience_loop");
    ambient_audio_element.pause();
    ambient_audio_element.src = "";
  };
}

export function play_one_shot_sound_effect(sound_effect_relative_path: string) {
  console.log("[DEBUG][audio_ambience] one_shot", sound_effect_relative_path);
  const one_shot_audio_element = new Audio(`${import.meta.env.BASE_URL}${sound_effect_relative_path}`);
  one_shot_audio_element.volume = 0.6;
  void one_shot_audio_element.play().catch(() => void 0);
}
