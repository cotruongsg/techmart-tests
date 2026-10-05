const { spawn } = require('child_process');
const path = require('path');

const LOCAL_PORT = 3000;

async function startTunnelAndTest() {
  console.log(`🚀 Đang khởi tạo Cloudflare Tunnel cho http://localhost:${LOCAL_PORT}...`);

  // Gọi trực tiếp cloudflared hoặc qua npx với shell: true trên Windows
  const tunnel = spawn('npx', ['cloudflared', 'tunnel', '--url', `http://localhost:${LOCAL_PORT}`], {
    shell: true, // Bắt buộc có trên Windows để nhận diện lệnh npx
  });

  let publicUrl = '';

  tunnel.stdout.on('data', (data) => {
    parseUrl(data.toString());
  });

  tunnel.stderr.on('data', (data) => {
    parseUrl(data.toString());
  });

  function parseUrl(output) {
    // Tìm URL dạng https://xxx.trycloudflare.com trong log
    const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !publicUrl) {
      publicUrl = match[0];
      console.log(`✅ Cloudflare Tunnel đã sẵn sàng: ${publicUrl}`);
      runPlaywright(publicUrl);
    }
  }

  function runPlaywright(baseUrl) {
    console.log(`🧪 Đang chạy Playwright tests trên URL: ${baseUrl}`);

    // Lấy tất cả tham số phía sau lệnh node run-tunnel-test.js
    const extraArgs = process.argv.slice(2);

    // Ghép các tham số đó vào lệnh playwright test
    const playwright = spawn('npx', ['playwright', 'test', ...extraArgs], {
      env: { ...process.env, BASE_URL: baseUrl },
      stdio: 'inherit',
      shell: true,
    });

    playwright.on('close', (code) => {
      console.log(`🏁 Playwright hoàn tất với mã thoát: ${code}`);
      tunnel.kill();
      process.exit(code);
    });
  }
}

startTunnelAndTest();