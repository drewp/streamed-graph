from invoke import task  # pytype: disable=import-error


@task
def setup_npm(ctx):
    ctx.run('npm install')

@task
def serve_demo(ctx):
    ctx.run('webfsd -Fp 8021')

@task
def build(ctx):
    ctx.run(f'npm run build', pty=True)

@task
def build_forever(ctx):
    ctx.run(f'npm run build_forever', pty=True)

@task
def test(ctx):
    ctx.run(f'npm run test', pty=True)

@task
def test_forever(ctx):
    ctx.run(f'npm run test_forever', pty=True)

@task(pre=[build])
def install(ctx):
    ctx.run(f'cp build/bundle.js         /my/site/homepage/www/rdf/streamed-graph.bundle.js')
    ctx.run(f'cp src/streamed-graph.css  /my/site/homepage/www/rdf/streamed-graph.css')
