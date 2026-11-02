# Happy Place Website Project

*(Note: This project is fictional and created for academic purposes.)*

---

## Student Information

* **Student Name:** MALESHOANE BOTIPE
* **Student ID:** ST10520975
* **Course / Module:** WEB DEVELOPMENT
* **Date:** 02 November 2026 (Part 3 submission)

---

## Live Website and Repository

* **Live website (deployed):** `PASTE YOUR NETLIFY / GITHUB PAGES LINK HERE`
* **GitHub repository:** `PASTE YOUR REPOSITORY LINK HERE`

---

## Project Overview

### History & Background
Happy Place was started in 2000 by Nungu Nzondo in her home kitchen, where she began baking scones using a beloved family recipe passed down from her grandmother. In early 2026, Happy Place expanded into a brick-and-mortar storefront. Today, the business offers a variety of freshly made items including traditional scones, malva pudding, full-course meals ("plates"), and other comfort foods.

### Mission
To bring joy to everyone through delicious, home-cooked meals.

### Vision
To be the first-choice destination for anyone looking for a warm, comforting meal.

### Target Audience
* Local community members and neighbors.
* Employees working in nearby businesses and organizations.
* School students looking for quick, warm meals during breaks or after school.

---

## Website Goals and Objectives

* **Online Ordering:** Provide customers with an easy platform to enquire about and order food online.
* **Product Showcase:** Display all menu items with updated pricing and details.
* **Order & Inquiry Management:** Respond efficiently to customer enquiries and messages.
* **Bridge Communication Gap:** Move beyond sole reliance on Facebook and WhatsApp with a central hub for location, hours and menu pricing.

---

## Key Features and Functionality

* **Mobile-First Navigation:** A simple, concise menu optimized for mobile devices.
* **Dynamic Product Catalogue (Part 3):** Products are loaded from a JavaScript data array, with live search, category filter and sort.
* **Image Lightbox (Part 3):** Product and home page images open in an accessible larger view.
* **Accordion FAQ (Part 3):** Expandable questions on the About page.
* **Interactive Map (Part 3):** Leaflet + OpenStreetMap map with a marker for the store.
* **Enquiry Form (Part 3):** Validated form that returns an instant cost and availability quote.
* **Contact Form (Part 3):** Validated form that compiles the details into an email to the business.
* **Autumn-Inspired Visual Theme:** Warm browns, oranges and creams.

---

## Part 3 Details

### JavaScript (`script.js`)

| Feature | Where | How it works |
| :--- | :--- | :--- |
| Dynamic product listing | `product.html` | The `PRODUCTS` array is rendered into cards using DOM methods (`createElement`, `replaceChildren`). |
| Search, filter and sort | `product.html` | Search box, category dropdown and sort dropdown re-render the list on every input. A live count is announced to screen readers. |
| Lightbox gallery | `product.html`, `index.html` | Clicking (or pressing Enter on) an image opens a modal with a caption. Esc, the close button or clicking outside closes it, and focus returns to the image. |
| Accordion | `about.html` | Buttons toggle `aria-expanded` and the `hidden` attribute on each answer panel. |
| Interactive map | `contact.html` | Leaflet map with OpenStreetMap tiles and a popup marker. |
| Animations and transitions | All pages | CSS fade-in on product cards, scroll reveal (IntersectionObserver) on content cards, and a back-to-top button added with the DOM. All disabled for `prefers-reduced-motion`. |
| Enquiry quote | `enquiry.html` | After validation the script multiplies price by quantity and checks lead time (1 day for scones, sliders and malva pudding; +1 day for orders above 10). It shows the total and whether the chosen date is available. |
| Contact email | `contact.html` | After validation the details are compiled into a `mailto:` link to the recipient set in `data-recipient`. The user previews the email and sends it from their email app. |

### Form validation
* HTML5 attributes: `required`, `type="email"`, `type="tel"`, `type="number"` with `min`/`max`, `type="date"` with `min`/`max`, `maxlength`.
* JavaScript rules: name (letters, 2-60 characters), email format, South African phone format (`0` or `+27` followed by 9 digits), a selected option, quantity 1-50, date not in the past and within 90 days, message 10-500 characters.
* Errors appear under each field (with `aria-invalid` and `role="alert"`) and are checked again when the user leaves a field.
* **AJAX submission:** both forms send their data with `fetch()` as JSON without reloading the page. The `data-endpoint` attribute points at the free JSONPlaceholder test API. To receive real submissions, replace it with a Formspree (or similar) endpoint.

### SEO
* **Keyword research:** target phrases are *homemade food Dealesville*, *comfort food Dealesville*, *scones Dealesville*, *malva pudding*, *fried chicken and burgers*, *food order enquiry* and *Happy Place Dealesville*. They are used naturally in titles, headings, descriptions and body text.
* **Title tags and meta descriptions:** unique for every page (see each `<head>`).
* **Header tags:** one `h1` per page, then `h2`/`h3` in order.
* **Image optimisation:** descriptive file names (for example `malva-pudding-custard.jpg`), descriptive `alt` text, `width`/`height` attributes, lazy loading below the fold.
* **URL structure:** short descriptive file names (`about.html`, `product.html`, `enquiry.html`, `contact.html`). Netlify also serves them without `.html`.
* **Internal linking:** body text links between the Home, About, Products, Enquiry and Contact pages.
* **Mobile-friendliness:** viewport tag, responsive layout with breakpoints, large tap targets.
* **Social sharing and structured data:** Open Graph tags, canonical links and `FoodEstablishment` JSON-LD (address, phone, hours, price range, coordinates).
* **`robots.txt` and `sitemap.xml`:** crawlers may access every page and the sitemap lists all five pages.
* **Off-page SEO plan:**
  * *Backlinks:* ask local Dealesville pages, schools and nearby businesses to link to the site, and list the business in local directories.
  * *Social media:* share menu photos and the website link on the existing Facebook and WhatsApp channels.
  * *Local SEO:* create a Google Business Profile with the same name, address, phone and hours as the website, and ask customers for reviews.

### Deployment
The site is deployed from the GitHub repository on a free platform (Netlify or GitHub Pages). After deploying, replace `https://happy-place-dealesville.netlify.app` in the HTML files, `robots.txt` and `sitemap.xml` with the real address.

---

## Sitemap

```
Happy Place Website Structure
│
├── Home Page (index.html)
│   ├── Business Overview
│   └── Popular Picks (lightbox images)
│
├── About (about.html)
│   ├── Story, Mission, Why Choose Us
│   └── FAQ Accordion
│
├── Products (product.html)
│   └── Searchable / filterable / sortable menu
│
├── Enquiry (enquiry.html)
│   └── Enquiry form with cost and availability quote
│
├── Contact (contact.html)
│   ├── Contact details and hours
│   ├── Interactive map
│   └── Contact form (compiles an email)
│
├── robots.txt
└── sitemap.xml
```

---

## Changelog

* **v0.3.0 (2026-10-28) - Part 3: Enhancing Functionality and SEO**
  * **Feedback from Part 2 (edits made):**
    * Fixed image paths: all images now live in an `images/` folder with descriptive names, and `src` values match the real files.
    * Removed `srcset` entries that pointed to image sizes that did not exist (for example `fried-chicken-320.jpg`), so no images 404.
    * Added `width` and `height` to every image to stop layout shift while loading.
    * Corrected the README sitemap, which listed `products.html` and had no About or Enquiry page, so it now matches the real files.
    * Updated the history on the About page to match the README (started in 2000, storefront in 2026).
    * `PASTE ANY EXTRA POINTS FROM YOUR PART 2 FEEDBACK HERE, ONE BULLET EACH, AND WHAT YOU CHANGED.`
  * **JavaScript:**
    * Added `script.js` and linked it on every page with `defer`.
    * Product cards on `product.html` are now generated from a data array, with search, category filter and sort.
    * Added a lightbox for product and home page images (keyboard and screen reader accessible).
    * Added an accordion FAQ to `about.html`.
    * Replaced the Google Maps iframe on `contact.html` with a Leaflet / OpenStreetMap map (a Google Maps directions link remains as a fallback).
    * Added fade-in and scroll reveal animations and a back-to-top button, all switched off for reduced motion.
  * **Forms:**
    * `enquiry.html`: added quantity and date fields, JS validation with inline errors, AJAX submission and a cost/availability quote.
    * `contact.html`: added a new contact form (name, email, phone, message type, message), JS validation, AJAX submission and a compiled email the visitor sends to the business.
    * Replaced `novalidate`-free default browser messages with custom accessible error messages.
  * **SEO:**
    * Added a unique `<meta name="keywords">` tag to every page.
    * Rewrote title tags and meta descriptions for every page and added Dealesville keywords to headings and copy.
    * Added canonical links, Open Graph tags and `FoodEstablishment` JSON-LD.
    * Renamed images with descriptive file names.
    * Added `robots.txt` and `sitemap.xml`.
  * **CSS:** appended Part 3 styles (toolbar, lightbox, accordion, map, form feedback, result cards, animations) to `style.css` without changing the Part 2 styles.
  * **Deployment:** site deployed on a free platform (link at the top of this file).

* **v0.1.0 (2026-09-18):**
  * Initialized repository.
  * Created project proposal and comprehensive `README.md` file.
  * Planned website sitemap, wireframe structure, and color scheme (warm browns and cream).
  * Added initial image citations and academic reference section.

---

## References

* BBC Good Food. (2025) *Classic Scones Recipe*. Available at: https://www.bbcgoodfood.com/recipes/classic-scones .
* Lancewood. (2026) *Malva Pudding*. Available at: https://lancewood.co.za/recipes/malva-pudding/ .
* Midjourney. (2024) *Simple Loaded Fries with Cheese, Bacon, and Herbs* [AI-generated image]. Available at: https://www.midjourney.com .
* Taste of Home. (2025) *Tyler Smith's Classic Smash Burgers*. Available at: https://www.tasteofhome.com/recipes/tyler-smith-smash-burgers/ (Accessed: 18 September 2026).
* The Chopping Block. (2021) *Sloppy Joe Sliders*. Available at: https://www.thechoppingblock.com/blog/sloppy-joe-sliders .
* The Cooking Jar. (2024) *Crispy Buttermilk Fried Chicken*. Available at: https://thecookingjar.com/crispy-buttermilk-fried-chicken/ .
* W3Schools. (2026) *HTML & CSS Web Development Tutorials*. Available at: https://www.w3schools.com.
* Leaflet. (2023) *Leaflet: an open-source JavaScript library for interactive maps* (v1.9.4). Available at: https://leafletjs.com .
* OpenStreetMap contributors. (2026) *OpenStreetMap*. Available at: https://www.openstreetmap.org/copyright .
* MDN Web Docs. (2026) *Client-side form validation*; *Fetch API*; *Intersection Observer API*. Available at: https://developer.mozilla.org .
* Google. (2026) *SEO Starter Guide*; *Local Business structured data*. Google Search Central. Available at: https://developers.google.com/search .
* Schema.org. (2026) *FoodEstablishment*. Available at: https://schema.org/FoodEstablishment .
* sitemaps.org. (2026) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html .
* JSONPlaceholder. (2026) *Free fake REST API*. Available at: https://jsonplaceholder.typicode.com .
* iStock / Aninka Bongers-Sutherland. (n.d.) *Full plate of grilled chicken, pap, relish and corn* [stock photo]. Available at: https://www.istockphoto.com .