import hooks from 'remote-sys-base/Hooks';


export const {
  useLocale,
} = hooks.useLocale;

// 添加初始化方法，确保回调被触发
const initLocale = () => {
  hooks.useLocale.onExternalLocaleMessagesSet( async  (locale: LocaleType) => {
    console.log('locale', locale)
    const langModule = await import(`../../locales/${locale}.ts`)
    return langModule.default ?? {}
  });
};

// 默认导出初始化方法，供main.ts调用
export default initLocale;
