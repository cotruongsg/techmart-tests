const { spawn } = require('child_process');

const LOCAL_PORT = 3000;

// 1. Hàm kiểm tra HTTP status của Tunnel bằng native fetch
async function waitForTunnel(url, maxRetries = 10) {
  console.log(`⏳ Đang kiểm tra kết nối Tunnel: ${url}...`);
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.status < 1000) {
        console.log(`✅ Tunnel đã sẵn sàng (Status: ${res.status})!`);
        return;
      }
    } catch {      
      // Bỏ qua lỗi kết nối trong những lượt ping đầu
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('❌ Timeout: Cloudflare Tunnel không phản hồi.');
}

// 2. Lấy URL Tunnel từ stdout/stderr của cloudflared
function getTunnelUrl(tunnelProcess) {
  return new Promise((resolve) => {
    const parseUrl = (data) => {
      const match = data.toString().match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (match) resolve(match[0]);
    };
    tunnelProcess.stdout.on('data', parseUrl);
    tunnelProcess.stderr.on('data', parseUrl);
  });
}

// 3. Luồng thực thi chính
(async () => {
  console.log(`🚀 Đang khởi tạo Cloudflare Tunnel cho http://localhost:${LOCAL_PORT}...`);
  
  const tunnel = spawn('npx', ['cloudflared', 'tunnel', '--url', `http://localhost:${LOCAL_PORT}`], {
    shell: true,
  });

  try {
    const publicUrl = await getTunnelUrl(tunnel);
    console.log(`🔗 Tìm thấy URL: ${publicUrl}`);

    // Health check đảm bảo không dính lỗi 1033
    await waitForTunnel(publicUrl);
    await new Promise((r) => setTimeout(r, 1000)); // Delay 1s cho kết nối ổn định hoàn toàn

    // Lấy toàn bộ tham số truyền sau "node run-tunnel-test.js"
    const extraArgs = process.argv.slice(2);
    console.log(`🧪 Đang chạy Playwright tests trên URL: ${publicUrl}`);

    const playwright = spawn('npx', ['playwright', 'test', ...extraArgs], {
      env: { ...process.env, BASE_URL: publicUrl },
      stdio: 'inherit',
      shell: true,
    });

    playwright.on('close', (code) => {
      console.log(`🏁 Playwright hoàn tất với mã thoát: ${code}`);
      tunnel.kill();
      process.exit(code);
    });
  } catch (err) {
    console.error(err.message);
    tunnel.kill();
    process.exit(1);
  }
})();