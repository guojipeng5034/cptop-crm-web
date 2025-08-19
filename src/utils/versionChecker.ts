import { ElMessageBox } from 'element-plus'

import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app';

const DEFAULT_VERSION_CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30分钟
let versionCheckIntervalId: number | null = null;
let promptShownForVersion: string | null = null;
let isMessageBoxVisible = false; // 标记弹窗是否正在显示
const { wsCache } = useCache()

/**
 * 检查新版本
 */
async function checkVersion(): Promise<void> {
  const { t } = useI18n(); // 国际化
  const appStore = useAppStore();
  const currentVersion = import.meta.env.VITE_APP_VERSION;
  const versionCheckUrl = import.meta.env.VITE_VERSION_CHECK_URL || '/version.json';

  if (!currentVersion) {
    // 只在开发环境输出
    if (import.meta.env.DEV) {
      console.warn('VITE_APP_VERSION 未定义，跳过版本检查。');
    }
    return;
  }

  try {
    const response = await fetch(`${versionCheckUrl}?t=${new Date().getTime()}`);
    if (!response.ok) {
      console.error(`获取版本信息失败: HTTP 状态 ${response.status}，URL: ${versionCheckUrl}`);
      return;
    }
    const versionInfo = await response.json();
    const latestVersionInfo = versionInfo?.updateLog?.slice(-1)[0];
    console.log('最新版本:' + latestVersionInfo.version)
    console.log('当前版本:' + currentVersion)
    if (versionInfo && latestVersionInfo.version) {
      if (latestVersionInfo.version !== currentVersion) {
        // 新版本可用
        if (latestVersionInfo.version !== promptShownForVersion && !isMessageBoxVisible) {
          promptShownForVersion = latestVersionInfo.version;
          isMessageBoxVisible = true;
          const message = latestVersionInfo.content
            .map((item: string, index: number) => {
              const content = item.split('.')[1] || item
              return `<b>${index + 1}.</b>${content}`
            })
            .join('<br>')
          ElMessageBox.confirm(message, '新版本 ' + latestVersionInfo.version + ' 更新内容', {
            confirmButtonText: t('versionChecker.refresh'),
            cancelButtonText: t('versionChecker.later'),
            dangerouslyUseHTMLString: true,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false
          })
            .then(() => {
              wsCache.delete(CACHE_KEY.USER)
              wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
              window.location.reload()
            })
        }
      } else {
        // 已是最新版本
        if (appStore.getNewVersionInfo) { // 修复linter报错，去掉括号
          appStore.setNewVersionInfo(null);
        }
        if (promptShownForVersion && promptShownForVersion === currentVersion) {
          promptShownForVersion = null;
        }
      }
    }
  } catch (error) {
    console.error(`检查版本失败: ${versionCheckUrl}`, error);
  }
}

/**
 * 启动版本检查定时器
 */
export function startVersionChecker(): void {
  checkVersion().catch(error => {
    console.error('初始版本检查出错:', error);
  });

  const intervalMs = Number(import.meta.env.VITE_VERSION_CHECK_INTERVAL_MS) || DEFAULT_VERSION_CHECK_INTERVAL_MS;
  if (intervalMs > 0) {
    if (versionCheckIntervalId !== null) {
      clearInterval(versionCheckIntervalId);
    }
    versionCheckIntervalId = setInterval(async () => {
      await checkVersion();
    }, intervalMs) as unknown as number;
    // 只在开发环境输出
    if (import.meta.env.DEV) {
      console.log(`已配置定期版本检查，每${intervalMs / 60000}分钟一次。定时器ID: ${versionCheckIntervalId}`);
    }
  }
}

/**
 * 停止版本检查定时器
 */
export function stopVersionChecker(): void {
  if (versionCheckIntervalId !== null) {
    clearInterval(versionCheckIntervalId);
    versionCheckIntervalId = null;
    // 只在开发环境输出
    if (import.meta.env.DEV) {
      console.log('定期版本检查器已停止。');
    }
  }
}

