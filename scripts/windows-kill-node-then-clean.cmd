@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."

echo.
echo ============================================================
echo   AgentMarket：先结束 Node，再删除 node_modules
echo ============================================================
echo.
echo 若出现「另一个程序正在使用此文件」，通常是本项目的
echo   npm run dev / prisma studio / 其它终端里的 node 未退出。
echo.
echo 本脚本会执行：taskkill /F /IM node.exe
echo   这会关闭本机上【所有】名为 node.exe 的进程。
echo   若你还在跑其它 Node 项目，请先保存并退出后再继续。
echo.
pause

taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
  echo 未找到正在运行的 node.exe，或结束失败（可忽略）。
) else (
  echo 已尝试结束 node.exe。
)

echo 等待 2 秒释放文件句柄…
timeout /t 2 /nobreak >nul

if exist "node_modules" (
  echo 正在删除 node_modules …
  rmdir /s /q "node_modules"
  if exist "node_modules" (
    echo.
    echo 删除仍失败：请关闭 Cursor/VS Code 与资源管理器中打开的该文件夹，
    echo 或将本项目加入杀毒软件排除项后重试；仍不行可重启后再运行本脚本。
    pause
    exit /b 1
  )
  echo 已删除 node_modules。
) else (
  echo 当前目录下没有 node_modules，跳过删除。
)

if exist "package-lock.json" del /f /q "package-lock.json"

echo.
echo 下一步在项目根执行：npm install
echo.
pause
endlocal
