from invoke import task  # pytype: disable=import-error


@task
def setup_npm(ctx):
    ctx.run('yarn install')

@task
def serve_demo(ctx):
    ctx.run('yarn webpack-dev-server')

@task
def build(ctx):
    ctx.run(f'yarn run webpack-build', pty=True)  # --debug --display-error-details
    ctx.run(f'cp build/streamed-graph.bundle.js /my/site/homepage/www/rdf/streamed-graph.bundle.js')
    ctx.run(f'cp src/streamed-graph.css         /my/site/homepage/www/rdf/streamed-graph.css')

@task
def build_forever(ctx):
    ctx.run(f'yarn run webpack-build-forever', pty=True)

@task
def dev_server(ctx):
    ctx.run(f'yarn webpack-dev-server', pty=True)

@task
def test(ctx):
    ctx.run(f'yarn test', pty=True)

@task
def test_forever(ctx):
    ctx.run(f'yarn test-forever', pty=True)

# one time per machine:
# yarn policies set-version v2
# in vscode, ctrl-p then: ext install ark120202.vscode-typescript-pnp-plugin
# or see https://next.yarnpkg.com/advanced/pnpify for a compatibility runner.
