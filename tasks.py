from invoke import task  # pytype: disable=import-error


@task
def setup_js(ctx):
    ctx.run('pnpm install')

@task(pre=[setup_js])
def serve_demo(ctx):
    ctx.run('webfsd -Fp 8021')

@task(pre=[setup_js])
def build(ctx):
    ctx.run(f'pnpm run build', pty=True)

@task(pre=[setup_js])
def build_forever(ctx):
    ctx.run(f'pnpm run build_forever', pty=True)

@task(pre=[setup_js])
def test(ctx):
    ctx.run(f'pnpm run test', pty=True)

@task(pre=[setup_js])
def test_forever(ctx):
    ctx.run(f'pnpm run test_forever', pty=True)
