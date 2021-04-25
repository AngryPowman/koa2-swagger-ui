/// <reference types="koa" />
/// <reference types="koa-compose" />
import { Router } from "koa-joi-router";
import { KoaSwaggerUiOptions } from "./koa2-swagger";
declare type BaseSpec = {
    info: {
        title: string;
        version: string;
        description: string;
    };
    tags: Array<{
        name: string;
        description: string;
    }>;
    basePath: string;
};
export declare class Koa2SwaggerUIComponent {
    static boost(router: Router, config: {
        swaggerOptions: Partial<KoaSwaggerUiOptions>;
        baseSpec: BaseSpec;
    }): import("koa-compose").Middleware<import("koa").ParameterizedContext<import("koa").DefaultState, import("koa").DefaultContext, any>>;
}
export {};
