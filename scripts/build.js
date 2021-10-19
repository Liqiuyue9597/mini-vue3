const fs = require('fs');
const execa = require('execa');

const targets = fs.readdirSync('packages').filter(file => {
  return fs.statSync(`packages/${file}`).isDirectory();
});


async function build(target) {
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], 
  {stdio: 'inherit'}); // 把子进程打包的信息共享给父进程
}

function runParallel(targets, iteratorFn) {
  const res = [];
  for (const item of targets) {
    res.push(iteratorFn(item));
  }
  return Promise.all(res);
}

runParallel(targets, build);