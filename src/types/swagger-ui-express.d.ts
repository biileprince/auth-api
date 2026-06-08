declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';

  interface SwaggerUiOptions {
    customCss?: string;
    customfavIcon?: string;
    customSiteTitle?: string;
    swaggerUrl?: string;
    explorer?: boolean;
  }

  const serve: RequestHandler[];
  function setup(
    swaggerDoc: Record<string, unknown>,
    opts?: SwaggerUiOptions
  ): RequestHandler;

  export { serve, setup };
}
