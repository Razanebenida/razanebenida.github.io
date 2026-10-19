# Razane Benida — personal website

A responsive, static website for GitHub Pages. No paid hosting, package installation, or build step is required.

## Publish free on GitHub Pages

1. Sign in to GitHub and confirm your account username. `Razane.benida` may be your display name: GitHub usernames cannot contain a dot.
2. Create a **public** repository named `YOUR-USERNAME.github.io`, replacing YOUR-USERNAME with your actual GitHub username.
3. Upload the contents of this folder directly to the repository root, including the assets folder. index.html must be at the root, not inside a second folder. GitHub's web uploader may hide .nojekyll; it is optional for this plain HTML website.
4. Open repository Settings → Pages. Choose **Deploy from a branch**, **main**, and **/(root)**. Save.
5. Your website will be available at https://YOUR-USERNAME.github.io after deployment completes.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Add articles, podcasts and research

Edit publications.js in GitHub using the pencil icon. Add objects inside the square brackets, separated by commas:

```js
window.PUBLICATIONS = [
  {
    type: "Article",
    title: "Your article title",
    date: "2026-10-19",
    description: "A short description of your article.",
    url: "https://example.com/your-article"
  },
  {
    type: "Podcast",
    title: "Your episode title",
    date: "2026-10-20",
    description: "Your guest and the topics discussed.",
    url: "https://example.com/your-episode"
  }
];
```

Replace example links with the real public links before committing. Supported types are Article, Podcast, and Research. Newest dates appear first. Filtering and search update automatically. To host a written article directly, upload a PDF into assets and use its full public GitHub Pages URL. For a playable podcast embed or on-site article pages, extend the website when the actual material is ready.

The featured Women in Finance introduction is in index.html. Replace its “Episode links coming soon” span with a real podcast link when available.

## Update your details

- Biography, experience, education and contact: index.html.
- Colour, spacing and layout: styles.css.
- Photo: assets/razane-benida.png.
- CV: replace assets/Razane_Benida_CV.pdf with your new PDF using the same filename.
- The supplied CV download includes your phone number and email, exactly as in the original document.

## Search visibility

The site includes a descriptive title, description, semantic headings and Person structured data. Once the public URL is known, add an absolute canonical URL, an absolute og:image URL for the portrait, and a sitemap.xml using that URL. Submit the URL in Google Search Console and add it to LinkedIn and your CV. Indexing takes time and ranking is not guaranteed.

## Preview locally

Open index.html in a browser or run `python3 -m http.server 8000` from this folder and visit http://localhost:8000. Google Fonts requires internet access; Georgia and Arial provide offline fallbacks.
