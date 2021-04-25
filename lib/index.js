"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koa2SwaggerUIComponent = void 0;
const koa2_swagger_1 = require("./koa2-swagger");
class Koa2SwaggerUIComponent {
    boost(config) {
        return koa2_swagger_1.koaSwagger(config);
    }
}
exports.Koa2SwaggerUIComponent = Koa2SwaggerUIComponent;
