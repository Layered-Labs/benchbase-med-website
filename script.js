// Copy buttons on code blocks, and a contents list that follows the section in view.

document.querySelectorAll(".code").forEach((block) => {
  const head = Object.assign(document.createElement("div"), { className: "code-head" });
  const lang = Object.assign(document.createElement("span"), {
    className: "code-lang",
    textContent: block.dataset.lang || "text",
  });
  const button = Object.assign(document.createElement("button"), {
    className: "copy",
    type: "button",
    textContent: "Copy",
  });
  button.addEventListener("click", async () => {
    const text = block.querySelector("pre").innerText.replace(/\s+$/, "");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = Object.assign(document.createElement("textarea"), { value: text });
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    button.textContent = "Copied";
    button.dataset.done = "true";
    setTimeout(() => {
      button.textContent = "Copy";
      delete button.dataset.done;
    }, 1600);
  });
  head.append(lang, button);
  block.prepend(head);
});

const links = [...document.querySelectorAll(".toc a")];
if (links.length) {
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const seen = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null));
      const current = [...seen.entries()].filter(([, top]) => top !== null).sort((a, b) => a[1] - b[1])[0];
      links.forEach((a) => a.removeAttribute("aria-current"));
      if (current) byId.get(current[0])?.setAttribute("aria-current", "true");
    },
    { rootMargin: "-15% 0px -70% 0px" }
  );
  document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));
}