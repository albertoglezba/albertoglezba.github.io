// Copy for both language choices. English is the default.
const messages = {
  en: {
    eyebrow: "Personal website",
    title: "Under development",
    message: "I'm renewing (building) this website, it will be available quite soon.",
    resumeDownload: "Download my résumé (PDF)",
    contactHeading: "Contact details",
    reveal: "Click to reveal as text",
    close: "Hide contact details",
    footer: "© October 2026",
    language: "Choose language",
    revealButton: "Reveal contact details as text"
  },
  es: {
    eyebrow: "Sitio personal",
    title: "En desarrollo",
    message: "Me encuentro renovando (construyendo) este sitio, estara disponible muy pronto.",
    resumeDownload: "Descargar mi currículum (PDF)",
    contactHeading: "Datos de contacto",
    reveal: "Haz clic para verlos como texto",
    close: "Ocultar datos de contacto",
    footer: "© Octubre de 2026",
    language: "Seleccionar idioma",
    revealButton: "Mostrar datos de contacto como texto"
  }
};

const resumeFiles = {
  en: { path: "Resume_G_Alberto_Glez_Btta_v2026_EN.pdf", filename: "Resume_G_Alberto_Glez_Btta_v2026_EN.pdf" },
  es: { path: "CV_G_Alberto_Glez_Btta_v2026_ES.pdf", filename: "CV_G_Alberto_Glez_Btta_v2026_ES.pdf" }
};

// Encoding keeps contact text out of the static page; it is reversible and
// only discourages basic text crawlers. The public image can still be OCRed.
const decode = (value) => new TextDecoder().decode(
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
);
const contact = {
  name: "R2VyYXJkbyBBbGJlcnRvIEdvbnrDoWxleiBCYXV0aXN0YQ==",
  city: "TWV4aWNvIENpdHksIE1leGljbw==",
  phone: "KzUyIDU1LTU0MDMtNDUzMw==",
  email: "YWxiZXJ0b2dsZXpiYUBnbWFpbC5jb20=",
  linkedin: "aHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vYWxiZXJ0b2dsZXpiYQ==",
  github: "aHR0cHM6Ly9naXRodWIuY29tL2FsYmVydG9nbGV6YmE="
};

const languageButtons = document.querySelectorAll("[data-language]");
const revealButton = document.querySelector("#contact-toggle");
const details = document.querySelector("#contact-details");
const resumeDownload = document.querySelector(".resume-download");
let language = "en";

function setLanguage(nextLanguage) {
  language = messages[nextLanguage] ? nextLanguage : "en";
  resumeDownload.href = resumeFiles[language].path;
  resumeDownload.download = resumeFiles[language].filename;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = messages[language][element.dataset.i18n];
  });
  document.querySelector(".language-toggle").setAttribute("aria-label", messages[language].language);
  revealButton.setAttribute("aria-label", messages[language].revealButton);
  languageButtons.forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const closeButton = details.querySelector("button");
  if (closeButton) closeButton.textContent = messages[language].close;
}

function addLine(parent, text, href) {
  const line = document.createElement("p");
  if (href) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    line.append(link);
  } else {
    line.textContent = text;
  }
  parent.append(line);
}

function showContact() {
  const heading = document.createElement("h2");
  heading.textContent = messages[language].contactHeading;
  details.replaceChildren(heading);
  addLine(details, decode(contact.name));
  addLine(details, `${decode(contact.city)} · ${decode(contact.phone)}`, `tel:${decode(contact.phone).replaceAll(" ", "")}`);
  addLine(details, decode(contact.email), `mailto:${decode(contact.email)}`);
  addLine(details, decode(contact.linkedin).replace(/^https?:\/\//, ""), decode(contact.linkedin));
  addLine(details, decode(contact.github).replace(/^https?:\/\//, ""), decode(contact.github));

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = messages[language].close;
  close.addEventListener("click", hideContact);
  details.append(close);
  revealButton.hidden = true;
  details.hidden = false;
}

function hideContact() {
  details.hidden = true;
  revealButton.hidden = false;
  revealButton.focus();
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});
revealButton.addEventListener("click", showContact);
setLanguage(language);
