from invoke import task  # pytype: disable=import-error


@task
def setup_npm(ctx):
    ctx.run('yarn install')

@task
def serve_demo(ctx):
    ctx.run('yarn webpack-dev-server --config webpack-dev.config.ts  --port 8082')

@task
def build(ctx):
    ctx.run(f'yarn run webpack-cli --config webpack.config.js --mode production')  # --debug --display-error-details
    ctx.run(f'cp build/streamed-graph.bundle.js /my/site/homepage/www/rdf/streamed-graph.bundle.js')
    ctx.run(f'cp streamed-graph.css /my/site/homepage/www/rdf/streamed-graph.css')

@task
def test(ctx):
    ctx.run(f'node_modules/.bin/webpack-cli --config webpack-test.config.ts')
    ctx.run(f'node_modules/.bin/ts-node node_modules/.bin/jasmine --config=jasmine.json')

# one time:
# yarn policies set-version v2
# in vscode, ctrl-p then: ext install ark120202.vscode-typescript-pnp-plugin
# or see https://next.yarnpkg.com/advanced/pnpify for a compatibility runner.
