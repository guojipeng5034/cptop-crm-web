import Utils from 'remote-sys-base/Utils';

export function exportExcel(headers, data, fileName = "数据.xlsx") {
  Utils.download.exportExcel(headers, data, fileName);
}


export default Utils.download
