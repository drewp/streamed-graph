from invoke import task  # pytype: disable=import-error


@task
def setup_npm(ctx):
    ctx.run('npm run install')

@task
def serve_demo(ctx):
    ctx.run('npm run webpack-dev-server')

@task
def build(ctx):
    ctx.run(f'npm run webpack-build', pty=True)
    ctx.run(f'cp build/bundle.js         /my/site/homepage/www/rdf/streamed-graph.bundle.js')
    ctx.run(f'cp src/streamed-graph.css  /my/site/homepage/www/rdf/streamed-graph.css')

@task
def build_forever(ctx):
    ctx.run(f'npm run run webpack-build-forever', pty=True)

@task
def dev_server(ctx):
    ctx.run(f'npm run webpack-dev-server', pty=True)

@task
def test(ctx):
    ctx.run(f'npm run test', pty=True)

@task
def test_forever(ctx):
    ctx.run(f'npm run test-forever', pty=True)
