import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

export function initLogoRevealLoader() {
  gsap.registerPlugin(CustomEase, SplitText);
  console.log("initLogoRevealLoader called");
  CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");

  const wrap = document.querySelector("[data-load-wrap]");
  if (!wrap) return;

  const container = wrap.querySelector("[data-load-container]");
  const bg = wrap.querySelector("[data-load-bg]");
  const progressBar = wrap.querySelector("[data-load-progress]");
  const logo = wrap.querySelector("[data-load-logo]");
  const textElements = Array.from(wrap.querySelectorAll("[data-load-text]"));

  // Reset targets that are * not * split text targets
  const resetTargets = Array.from(
    wrap.querySelectorAll("[data-load-reset]:not([data-load-text])")
  );

  // Main loader timeline
  const loadTimeline = gsap
    .timeline({
      defaults: {
        ease: "loader",
        duration: 3,
      },
    })
    .set(wrap, { display: "block" })
    .to(progressBar, { scaleX: 1 })
    .to(logo, { clipPath: "inset(0% 0% 0% 0%)" }, "<")
    .to(container, { autoAlpha: 0, duration: 0.5 })
    .to(
      progressBar,
      { scaleX: 0, transformOrigin: "right center", duration: 0.5 },
      "<"
    )
    .add("hideContent", "<")
    .to(bg, { yPercent: -101, duration: 1 }, "hideContent")
    .set(wrap, { display: "none" });

  // If there are items to hide FOUC for, reset them at the start
  if (resetTargets.length) {
    loadTimeline.set(resetTargets, { autoAlpha: 1 }, 0);
  }

  // If there's text items, split them, and add to load timeline
  if (textElements.length >= 2) {
    const firstWord = new SplitText(textElements[0], {
      type: "lines,chars",
      mask: "lines",
    });
    const secondWord = new SplitText(textElements[1], {
      type: "lines,chars",
      mask: "lines",
    });

    // Set initial states of the text elements and letters
    gsap.set([firstWord.chars, secondWord.chars], {
      autoAlpha: 0,
      yPercent: 125,
    });
    gsap.set(textElements, { autoAlpha: 1 });

    // first text in
    loadTimeline.to(
      firstWord.chars,
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.6,
        stagger: { each: 0.02 },
      },
      0
    );

    // first text out while second text in
    loadTimeline.to(
      firstWord.chars,
      {
        autoAlpha: 0,
        yPercent: -125,
        duration: 0.4,
        stagger: { each: 0.02 },
      },
      ">+=0.4"
    );

    loadTimeline.to(
      secondWord.chars,
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.6,
        stagger: { each: 0.02 },
      },
      "<"
    );

    // second text out
    loadTimeline.to(
      secondWord.chars,
      {
        autoAlpha: 0,
        yPercent: -125,
        duration: 0.4,
        stagger: { each: 0.02 },
      },
      "hideContent-=0.5"
    );
  }
}
