import { SwaggerAPI } from "koa-joi-router-docs";
import { Router } from "koa-joi-router";
import { koaSwagger, KoaSwaggerUiOptions } from "./koa2-swagger";
type BaseSpec = {
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
export class Koa2SwaggerUIComponent {
  static boost(
    router: Router,
    config: {
      uiOptions: Partial<KoaSwaggerUiOptions>;
      baseSpec: BaseSpec;
    }
  ) {
    let swagger = new SwaggerAPI();
    swagger.addJoiRouter(router);

    const spec = swagger.generateSpec(config.baseSpec, {
      defaultResponses: {},
    }) as Record<string, unknown>;

    return koaSwagger({ ...config.uiOptions, swaggerOptions: { spec } });
  }
}
