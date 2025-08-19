// yudao-ui-admin-vue3/scripts/update-version-json.js
const fs = require('fs');
const path = require('path');

try {
  // Get the root directory of the yudao-ui-admin-vue3 project
  const projectRoot = path.resolve(__dirname, '../..'); // 脚本位于 yudao-ui-admin-vue3/scripts/

  // 1. 从 package.json 读取版本
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`在 ${packageJsonPath} 未找到 package.json`);
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const currentVersion = packageJson.version;

  if (!currentVersion) {
    throw new Error('在 package.json 中未找到版本号');
  }

  // 2. 定义输出路径 (例如 dist/version.json)
  // 假设 'dist' 是 vite 构建的默认输出目录，相对于 projectRoot
  const outputDir = path.join(projectRoot, 'dist');
  const outputPath = path.join(outputDir, 'version.json');

  // 3. 构建版本数据
  const versionData = {
    version: currentVersion,
  };

  // 4. 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`已创建输出目录: ${outputDir}`);
  }

  // 5. 写入到输出文件
  fs.writeFileSync(outputPath, JSON.stringify(versionData, null, 2), 'utf8');
  console.log(`已成功更新/创建 ${outputPath}，版本为 ${currentVersion}`);

} catch (error) {
  console.error('更新 version.json 时出错:', error);
  process.exit(1); // 带错误码退出
}
