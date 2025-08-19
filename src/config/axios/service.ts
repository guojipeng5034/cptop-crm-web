import Axios  from 'remote-sys-base/Axios';

export function refreshAxiosData(){
  Axios.service.refreshAxiosData();
}

export const isRelogin = Axios.service.isRelogin
