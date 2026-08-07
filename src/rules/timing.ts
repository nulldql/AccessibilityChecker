import type { RuleMap } from "./types.js";

export const timing: RuleMap = {
  "meta-refresh": {
    category: "Timing & Motion",
    title: "Page automatically refreshes or redirects on a timer",
    why: "This can disorient screen reader and low-vision users who haven't finished reading, and there's often no way to stop it.",
    fix: "Remove the timed meta refresh, or replace it with a mechanism the user can control.",
  },
  blink: {
    category: "Timing & Motion",
    title: "Page uses the deprecated <blink> element",
    why: "Flashing/blinking content is distracting and can trigger seizures in people with photosensitive epilepsy.",
    fix: "Remove the <blink> element entirely and use CSS animation with user control if motion is really needed.",
  },
  marquee: {
    category: "Timing & Motion",
    title: "Page uses the deprecated <marquee> element",
    why: "Scrolling text that can't be paused is difficult to read for many users and is disorienting for screen magnifier users.",
    fix: "Remove the <marquee> element and use a pausable CSS or JS carousel if scrolling content is needed.",
  },
  "video-caption": {
    category: "Timing & Motion",
    title: "Video has no captions track",
    why: "Deaf and hard-of-hearing users, and anyone watching without sound, have no way to follow the audio content.",
    fix: "Add a <track kind=\"captions\"> element with a captions file for the video.",
  },
};
