"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.koaSwagger = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const lodash_1 = require("lodash");
const Handlebars = __importStar(require("handlebars"));
const defaultOptions = {
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
function koaSwagger(config = {}) {
    // Setup icons
    const extFavicon = config.favicon;
    const faviconPath = path_1.join(__dirname, defaultOptions.favicon);
    // Setup default options
    const options = lodash_1.defaultsDeep(config, defaultOptions);
    const specPrefixRegex = new RegExp(`${options.specPrefix}[/]*$`, "i");
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const routePrefixRegex = new RegExp(`${options.routePrefix}[/]*$`, "i");
    Handlebars.registerHelper("json", (context) => JSON.stringify(context));
    Handlebars.registerHelper("strfnc", (fnc) => fnc);
    Handlebars.registerHelper("isset", function (conditional, opt) {
        return conditional ? opt.fn(this) : opt.inverse(this);
    });
    const path = path_1.join(__dirname, "static/index.hbs");
    const index = fs_1.readFileSync(path, "utf-8");
    const renderContent = Handlebars.compile(index);
    // eslint-disable-next-line func-names
    return function koaSwaggerUi(ctx, next) {
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
            ctx.body = fs_1.createReadStream(faviconPath);
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
                }
                else if (asset.endsWith(".css")) {
                    ctx.type = "text/css";
                }
                ctx.body = fs_1.createReadStream(path_1.join(__dirname, `static/${asset}`));
                return true;
            }
        }
        return next();
    };
}
exports.koaSwagger = koaSwagger;
