import Axios  from 'remote-sys-base/Axios';
import { refreshAxiosData }  from './index'
import { refreshAxiosData as refreshAxiosData2  }  from './service'
export const {
  EnvConfig,
  initEnvConfig,
  createEnvConfig,
  env,
  getOAuth2BasicAuth,
} = Axios.config;

export function initAxiosConfig() {
  //ͳһ����axios
  const axios={
    BASE_URL: import.meta.env.VITE_BASE_URL,
    API_URL: import.meta.env.VITE_API_URL,
    HEADER_VERSION: import.meta.env.VITE_HEADER_VERSION || '',
    TENANT_ENABLE: import.meta.env.VITE_APP_TENANT_ENABLE === 'true',
    OAUTH2_PASSWORD_CLIENT: import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT || '',
    VITE_SYSTEM_MENU_NAME: import.meta.env.VITE_SYSTEM_MENU_NAME,

  }
  initEnvConfig(axios);
  refreshAxiosData();
  refreshAxiosData2();
}
