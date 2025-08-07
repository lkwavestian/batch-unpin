# 开发脚本 - 自动编译并启动调试
Write-Host "开始编译..." -ForegroundColor Green
npm run compile

if ($LASTEXITCODE -eq 0) {
    Write-Host "编译成功！按任意键启动调试..." -ForegroundColor Green
    Read-Host
    code --extensionDevelopmentPath=$PWD
} else {
    Write-Host "编译失败！" -ForegroundColor Red
} 