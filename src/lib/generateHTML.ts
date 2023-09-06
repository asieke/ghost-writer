import { lowlight } from 'lowlight/lib/core';
import { toHtml } from 'hast-util-to-html';

export const generateHTML = (html: string) => {
	let updated = html.replaceAll(/<mark(.*?)>/g, '<span$1>').replace(/<\/mark>/g, '</span>');

	updated = updated.replaceAll(/<pre><code.*?>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
		const highlightedCode = toHtml(lowlight.highlightAuto(code));
		return `<table class="code"><tr><td data-mce-style="color: #c1c7d0;" data-highlight-colour="#172b4d"><pre>${highlightedCode}</pre></td></tr></table>`;
	});

	//replace <blockquote> with <table class='blockquote'>
	updated = updated.replaceAll(
		/<blockquote>(.*?)<\/blockquote>/gi,
		'<table class="blockquote"><tr><td>$1</td></tr></table>'
	);

	const output = `
  <html>
    <body>
      ${updated}
    </body>
    <style>
    body {
      width: 90%;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji";
      color: rgb(70, 70, 70);
    }

    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 1.5em;
    }

    td,
    th {
      vertical-align: middle;
      border: 1px solid #ccc;
      padding: 10px;
      font-size: 1.5em;
    }

    h1 {
      color: rgb(0, 0, 0);
      font-size: 32px;
      letter-spacing: -1px;
    }

    h2 {
      color: rgb(20, 20, 20);
      font-size: 28px;
    }

    h3 {
      color: rgb(40, 40, 40);
      font-size: 24px;
    }

    p {
      line-height: 1.9em;
      font-size: 18px;
    }

    ul p,
    ol p,
    li p,
    {
      line-height: 1.5em;
      font-size: 18px;
    }

    td p, th p {
      line-height: 1em;
      font-size: 18px;
    }

    th {
      background-color: rgb(220, 220, 220);
      padding: 5px 10px;
      font-size: 18px;
    }

    table.code {
      width: 100%;
      font-size: 18px;
      background-color: black;
      color: white;

    }

    table.code td {
      background-color: black;
      vertical-align: middle;
      color: white;
      border: 0px;
      padding: 20px;
      font-size: 18px;
      font-family: 'Source Code Pro', monospace;
    }

    table.code pre {
      font-size: 18px;
      font-family: 'Source Code Pro', monospace;
    }

    table.blockquote {
      width: 100%;
      font-size: 18px;
    }

    table.blockquote td {
      border: 0px;
      border-left: 4px solid rgb(29, 30, 110);
      border-right: 1px solid rgb(240, 240, 240);
      background-color: rgb(240, 240, 240);
      padding: 20px;
      font-size: 18px;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  </style>
  </html>
  `;

	return output;
};
