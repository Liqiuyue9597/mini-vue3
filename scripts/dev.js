const fs = require('fs');
const execa = require('execa');

// const targets = fs.readdirSync('packages').filter(file => {
//   return fs.statSync(`packages/${file}`).isDirectory();
// });


async function build(target) {
  await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], 
  {stdio: 'inherit'}); // 把子进程打包的信息共享给父进程
}

build('reactivity');