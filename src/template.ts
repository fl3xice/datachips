import Showdown from "showdown";

export namespace DataChipsTemplate {
  const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        --background-default: #0e0e17;
        --background-container: #0a0a105b;

        --box-shadow-container: #5ef7ff2f;

        --text-color-default: #5ef6ff;
        --success-color-variant: #1ded83;

        --link-color-default: #f75049;
        --link-color-active: #fa3c35;
        --link-color-hover: #1cf4ff;

        --table-border-color: #5ef6ff;

        --sb-track-color: #0e0e17;
        --sb-thumb-color: #1cf4ff;
        --sb-size: 11px;
      }

      *::selection {
        background: var(--text-color-default);
        color: var(--background-default);
      }

      *::-webkit-scrollbar {
        width: var(--sb-size);
      }

      *::-webkit-scrollbar-track {
        background: var(--sb-track-color);
        border-radius: 1px;
      }

      *::-webkit-scrollbar-thumb {
        background: var(--sb-thumb-color);
        border-radius: 1px;
      }

      @supports not selector(::-webkit-scrollbar) {
        body {
            scrollbar-color: var(--sb-thumb-color)
                          var(--sb-track-color);
        }
      }

      body {
        background: var(--background-default);
        color: var(--text-color-default);
        font-family: "Fira Sans", sans-serif;
      }

      .container {
        margin: 6rem auto;
        background: var(--background-container);
        overflow-x: auto;
        max-height: 590px;
        padding: 1rem;
        border-left: 25px solid var(--text-color-default);
        transform: rotateY(0deg);
        box-shadow: var(--box-shadow-container) 0 0 150px 1px;
      }
      
      .container-warp {
        padding: 0 10rem;
        transform: perspective(1200px) rotateY(0deg);
        transform-origin: 52% center;
        animation: warp 10s ease-in-out 0.9s infinite alternate-reverse;
      }

      @keyframes warp {
        0% {
          transform: perspective(1200px) rotateY(0deg);
          perspective-origin: center 50%;
        }
        50% {
          transform: perspective(1900px) rotateY(5deg);
          perspective-origin: 25% 50%;
        }
        100% {
          transform: perspective(1200px) rotateY(2deg);
          perspective-origin: center 50%;
        }
      }

      a {
        color: var(--link-color-default);
        text-decoration: none;
        text-shadow: var(--link-color-default) 0px 0px 15px;
        transition: text-shadow 0.2s;
        font-weight: 500;
      }

      a:hover {
        transition: text-shadow 0.1s;
        text-shadow: var(--link-color-active) 0px 0px 25px;
        color: var(--link-color-hover);
      }

      a:active {
        color: var(--link-color-active);
      }

      p {
        max-width: 1920px;
      }

      .content {
        z-index: 2000;
      }

      .d-elm {
        position: relative;
        transform: translate(-40.99px, 0);
        z-index: 1000;
        width: 90%;
      }

      /**
        HEADERS
      **/

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        line-height: 0.3;
        margin: 25px 0;
      }

      /**
        TABLES
      **/

      table {
        border: solid var(--table-border-color) 5px;
        padding: 10px;
      }

      thead {
        background: #5ef6ff;
        color: var(--background-default);
      }

      thead th {
        padding: 0 10px;
      }

      thead th::selection {
        background: var(--background-default);
        color: var(--text-color-default);
      }

      del {
        transition: box-shadow 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
        box-shadow: var(--text-color-default) 0px -20px 0px 0px inset;
        text-decoration: none;
      }

      del:hover {
        transition: box-shadow 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
        box-shadow: var(--text-color-default) 0px 0px 0px 0px inset;
      }

      tbody td {
        padding: 0 10px;
        border: solid var(--table-border-color) 1px;
      }

      .copy-year {
        color: #f0b537;
        font-weight: 800;
      }

      code {
        font-family: "Courier New", Courier, monospace;
        font-weight: 800;
      }

      blockquote {
        border-left: solid var(--table-border-color) 5px;
        margin: 5px 20px 5px 0;
        padding: 1px 20px;
        font-size: 14pt;
      }

      @media screen and (min-width: 2373px) {
        .d-elm {
          width: 56%;
        }
      }
    </style>
  </head>
  <body>
    <div class="container-warp">
      <div class="container">
        <div class="content">
          {data}
        </div>
        <svg
          class="d-elm"
          height="113"
          viewBox="0 0 1925 113"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 6H1129.5L1176.5 53H1925"
            stroke="#5EF6FF"
            stroke-width="12"
          />
          <path
            d="M0 53H1073.5L1120.5 100H1825"
            stroke="#5EF6FF"
            stroke-width="25"
          />
        </svg>
        <p>Copyright &copy; flexice 2023 — <span class="copy-year">2077</span></p>
      </div>
    </div>
  </body>
</html>`;

  const CONVERTER = new Showdown.Converter({
    metadata: true,
    emoji: true,
    tables: true,
    openLinksInNewWindow: true,
    strikethrough: true,
  });

  export type HTML = string;
  export type TemplateOptions = {
    title?: string;
    data: string;
  };

  export type ConverterResult = {
    meta: Metadata;
    data: HTML;
    toTemplateOptions(): TemplateOptions;
  };

  export interface Metadata {
    title?: string;
  }

  export function generateByTemplate(options: TemplateOptions): HTML {
    let template_update = template.replace(
      "{title}",
      options.title || "Unnamed chip"
    );
    template_update = template_update.replace("{data}", options.data);

    return template_update;
  }

  export function convertMarkdown(
    markdown: string,
    title?: string
  ): ConverterResult {
    const data = CONVERTER.makeHtml(markdown);
    const meta: Metadata = CONVERTER.getMetadata(false) as Metadata;

    return {
      meta,
      data,
      toTemplateOptions() {
        return {
          data,
          title: meta.title || title || "Unnamed Chip",
        };
      },
    };
  }
}
