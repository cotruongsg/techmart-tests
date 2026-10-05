# TechMart Automation Tests

Dự án kiểm thử tự động cho ứng dụng TechMart sử dụng Playwright JS và Cloudflare Tunnel.

![Playwright Tests](https://github.com/cotruongsg/techmart-tests/actions/workflows/playwright.yml/badge.svg)

## Cấu trúc dự án
- `sample-app/`: Mã nguồn ứng dụng Web TechMart.
- `tests/`: Bộ test case Playwright JS.
- `run-tunnel-test.js`: Script tự động tạo Cloudflare Tunnel và truyền URL HTTPS vào Playwright.

## Chạy Test dưới Local
```bash
# Chạy tất cả test qua Cloudflare Tunnel
npm run test:tunnel

# Chạy file test chỉ định
npm run test:tunnel -- tests/login.spec.js
