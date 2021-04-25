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
      swaggerOptions: Partial<KoaSwaggerUiOptions>;
      baseSpec: BaseSpec;
    }
  ) {
    let swagger = new SwaggerAPI();
    const spec = swagger.generateSpec(config.baseSpec, {
      defaultResponses: {},
    }) as Record<string, unknown>;

    swagger.addJoiRouter(router);

    return koaSwagger({ ...config, swaggerOptions: { spec } });
  }
}
