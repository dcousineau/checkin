import path from 'path';
import nunjucks from 'nunjucks';

export default app => {
    nunjucks.configure(path.resolve(`${__dirname}/../views`), {
        autoescape: true,
        express: app
    });
};
