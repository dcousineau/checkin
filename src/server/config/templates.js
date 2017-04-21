import path from "path";
import nunjucks from "nunjucks";

/**
 * Formats a webpack generated asset path into a fully formed URI. Since webpack uses the build/static folder as its
 * base folder, all URLs are returned as relative to build/static (e.g. `js/appEntry.js`) and should have `/static/`
 * sprepended.
 * @param path
 * @return {string}
 */
const generateJSAssetUrl = path => `/static/${path}`;

/**
 * Returns a function that takes an entry point name and a language parameter
 * @param assetManifest
 * @return {Function}
 */
const getAssetBuilder = assetManifest => {
  //@TODO: cache this as well
  return bundleName => {
    const assets = [];

    assets.push(generateJSAssetUrl(assetManifest["manifest"]));
    assets.push(generateJSAssetUrl(assetManifest["vendors"]));

    const bundleManifest = assetManifest[bundleName];
    let bundles = bundleManifest;
    if (!Array.isArray(bundleManifest)) {
      bundles = [bundleManifest];
    }
    bundles.map(bundle => assets.push(generateJSAssetUrl(bundle)));

    return assets
      .map(url => `<script type="text/javascript" src="${url}"></script>`)
      .join("\n");
  };
};

export default app => {
  const env = nunjucks.configure(path.resolve(`${__dirname}/../views`), {
    autoescape: true,
    express: app
  });

  env.addFilter("json", function(input) {
    return markSafe(JSON.stringify(input));
  });

  app.use((req, res, next) => {
    res.renderApp = (template, vars, ...args) => {
      //@TODO: Cache the results of the asset manifest
      // At render time obtain the asset manifest. This is particularly needed HERE in development mode as Webpack
      // is likely not finished compiling the assets
      req.app.locals.loadAssetManifest((err, manifest) => {
        const assetManifest = manifest.assetsByChunkName;

        // Ensure all templates have access to the configuration
        const extendedVars = {
          assets: getAssetBuilder(assetManifest),
          ...vars
        };

        res.render(template, extendedVars, ...args);
      });
    };

    next();
  });
};
