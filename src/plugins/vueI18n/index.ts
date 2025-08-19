
import Plugins from 'remote-sys-base/Plugins';

Plugins.vueI18n.onExternalLocaleMessagesSet( async  (locale: LocaleType) => {
  const langModule = await import(`../../locales/${locale}.ts`)
  return langModule.default ?? {}
  // 你可以在这里做合并处理、注入 Element Plus 多语言等操作
});

export const {
  setupI18n,
  i18n,
} = Plugins.vueI18n;
