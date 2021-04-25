import { readFileSync, createReadStream } from "fs";
import { join } from "path";

import { defaultsDeep } from "lodash";
import * as Handlebars from "handlebars";
import type { Context, Middleware, Next } from "koa";
import type { HelperDelegate, HelperOptions } from "handlebars";

export interface SwaggerOptions {
  [key: string]:
    | string
    | boolean
    | string[]
    | Record<string, unknown>
    | null
    | undefined;
  dom_id?: string;
  url?: string;
  supportedSubmitMethods?: string[];
  docExpansion?: string;
  jsonEditor?: boolean;
  defaultModelRendering?: string;
  showRequestHeaders?: boolean;
  layout?: string;
  spec?: Record<string, unknown>;
  validatorUrl?: string | null;
}

export interface KoaSwaggerUiOptions {
  title: string;
  oauthOptions: boolean | any;
  swaggerOptions: SwaggerOptions;
  swaggerVersion: string;
  routePrefix: string | false;
  specPrefix: string;
  exposeSpec: boolean;
  hideTopbar: boolean;
  favicon: string;
}

const defaultOptions: KoaSwaggerUiOptions = {
  title: "Swagger UI",
  oauthOptions: false,
  swaggerOptions: {
    dom_id: "#swagger-ui",
    url: "https://petstore.swagger.io/v2/swagger.json",
    layout: "StandaloneLayout",
  },
  routePrefix: "/docs",
  specPrefix: "/docs/spec",
  swaggerVersion: "",
  exposeSpec: false,
  hideTopbar: false,
  favicon: "/favicon.png",
};

export function koaSwagger(
  config: Partial<KoaSwaggerUiOptions> = {}
): Middleware {

  // Setup icons
  const extFavicon = config.favicon;
  const faviconPath = join(__dirname, defaultOptions.favicon);

  // Setup default options
  const options: KoaSwaggerUiOptions = defaultsDeep(config, defaultOptions);

  const specPrefixRegex = new RegExp(`${options.specPrefix}[/]*$`, "i");
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const routePrefixRegex = new RegExp(`${options.routePrefix}[/]*$`, "i");

  Handlebars.registerHelper("json", (context) => JSON.stringify(context));
  Handlebars.registerHelper("strfnc", (fnc: HelperDelegate) => fnc);
  Handlebars.registerHelper(
    "isset",
    function (this: any, conditional: any, opt: HelperOptions) {
      return conditional ? opt.fn(this) : opt.inverse(this);
    }
  );

  const path = join(__dirname, "static/index.hbs");

  const index = readFileSync(path, "utf-8");
  const renderContent = Handlebars.compile(index);

  // eslint-disable-next-line func-names
  return function koaSwaggerUi(ctx: Context, next: Next) {
    if (options.exposeSpec && specPrefixRegex.test(ctx.path)) {
      ctx.body = options.swaggerOptions.spec;
      return true;
    }

    if (options.routePrefix === false || routePrefixRegex.test(ctx.path)) {
      ctx.type = "text/html";
      ctx.body = renderContent(options);
      return true;
    }

    if (extFavicon === undefined && ctx.path === defaultOptions.favicon) {
      ctx.type = "image/png";
      ctx.body = createReadStream(faviconPath);
      return true;
    }

    // 自己 serve 资源文件
    const assets = [
      "swagger-ui-bundle.js",
      "swagger-ui-standalone-preset.js",
      "swagger-ui.min.css",
    ];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (ctx.path.includes(asset)) {
        if (asset.endsWith(".js")) {
          ctx.type = "application/javascript";
        } else if (asset.endsWith(".css")) {
          ctx.type = "text/css";
        }

        ctx.body = createReadStream(join(__dirname, `static/${asset}`));
        return true;
      }
    }

    return next();
  };
}
