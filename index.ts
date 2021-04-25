import { koaSwagger, KoaSwaggerUiOptions } from "./koa2-swagger";

export class Koa2SwaggerUIComponent {
  boost(config: Partial<KoaSwaggerUiOptions>) {
    return koaSwagger(config);
  }
}
