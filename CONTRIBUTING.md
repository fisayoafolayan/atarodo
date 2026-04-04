# Contributing to Atarodo

Thanks for your interest in contributing to Atarodo. This guide will help you get started.

## Development setup

1. Fork and clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/atarodo.git
cd atarodo
npm install
```

2. Start a local Ghost instance with Docker:

```bash
npm run dev
```

3. Visit http://localhost:2368/ghost/ to create an admin account and configure the site.

The theme is mounted directly into Ghost via Docker volumes. Edit source files (`assets/css/style.css` and `assets/js/script.js`), then run `npm run build` to generate the minified versions. Changes to `.hbs` files are picked up on browser refresh. Restart the container after changing `package.json`.

## Project structure

- **Templates** (`.hbs`) - Handlebars templates using Ghost's theme API
- **CSS** (`assets/css/style.css`) - Single stylesheet using CSS custom properties. No preprocessor, no build step.
- **JS** (`assets/js/script.js`) - Vanilla JavaScript. No frameworks, no bundler.
- **Partials** (`partials/`) - Reusable template fragments

## Guidelines

### Code style

- **CSS**: Use the existing CSS custom properties (`--color-*`, `--font-*`). Don't hardcode colors - use variables so dark mode works automatically.
- **JS**: Vanilla JS only. No dependencies. Guard all DOM queries with null checks.
- **Templates**: Use Ghost's Handlebars helpers. Wrap optional content in `{{#if}}` blocks.

### Design principles

- **Minimal by default** - Don't add features unless they genuinely improve the reading experience
- **No build tools** - The theme should work as-is without npm, Grunt, Webpack, or any build step
- **Accessible** - Use semantic HTML, aria labels, and visible focus styles
- **Responsive** - Test on mobile (375px), tablet (768px), and desktop (1440px)
- **Dark mode aware** - Every visual change must work in both light and dark mode

### What to work on

- Check the [issues](https://github.com/fisayoafolayan/atarodo/issues) for open tasks
- Bug fixes are always welcome
- New features should be discussed in an issue first

### Testing

Before submitting a PR:

1. Build the minified files and run the theme validator:

```bash
npm run build
npm run lint
```

2. Test in both light and dark mode
3. Test on mobile and desktop
4. Test with and without a cover image on posts
5. Test with and without a logo set in Ghost Admin

## Submitting changes

1. Create a branch from `main`:

```bash
git checkout -b fix/your-change
```

2. Make your changes with clear, focused commits

3. Push and open a Pull Request against `main`

4. Describe what you changed and why

## Reporting bugs

Open an issue with:

- What you expected to happen
- What actually happened
- Browser and device
- Screenshot if it's a visual issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
