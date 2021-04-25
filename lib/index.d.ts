/// <reference types="koa" />
/// <reference types="koa-compose" />
import { KoaSwaggerUiOptions } from "./koa2-swagger";
export declare class Koa2SwaggerUIComponent {
    boost(config: Partial<KoaSwaggerUiOptions>): import("koa-compose").Middleware<import("koa").ParameterizedContext<import("koa").DefaultState, import("koa").DefaultContext, any>>;
}
