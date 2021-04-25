"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koa2SwaggerUIComponent = void 0;
const koa_joi_router_docs_1 = require("koa-joi-router-docs");
const koa2_swagger_1 = require("./koa2-swagger");
class Koa2SwaggerUIComponent {
    static boost(router, config) {
        let swagger = new koa_joi_router_docs_1.SwaggerAPI();
        swagger.addJoiRouter(router);
        const spec = swagger.generateSpec(config.baseSpec, {
            defaultResponses: {},
        });
        return koa2_swagger_1.koaSwagger(Object.assign(Object.assign({}, config.uiOptions), { swaggerOptions: { spec } }));
    }
}
exports.Koa2SwaggerUIComponent = Koa2SwaggerUIComponent;
