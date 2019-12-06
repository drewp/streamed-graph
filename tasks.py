from invoke import task  # pytype: disable=import-error


@task
def setup_npm(ctx):
    ctx.run('npm install')

@task
def serve_demo(ctx):
    ctx.run('node_modules/webpack-serve/bin/webpack-serve --config webpack-dev.config.ts --port 8082')

@task
def build(ctx):
    ctx.run(f'npm run build')
    ctx.run(f'cp build/streamed-graph.bundle.js /my/site/homepage/www/rdf/streamed-graph.bundle.js')
    ctx.run(f'cp streamed-graph.css /my/site/homepage/www/rdf/streamed-graph.css')

@task
def test(ctx):
    ctx.run(f'node_modules/ts-node/dist/bin.js node_modules/jasmine/bin/jasmine --config=jasmine.json')