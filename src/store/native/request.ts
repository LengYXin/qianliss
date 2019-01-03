import Taro, { request, uploadFile } from "@tarojs/taro";
import endsWith from 'lodash/endsWith';
import startsWith from 'lodash/startsWith';
import trimStart from 'lodash/trimStart';
export class WXRequestClass {
    constructor() {

    }
    address = "https://shop.jizhigame.com";
    requestConfig = {
        header: {
            'shop-token': '',
            'content-type': 'application/json'
        }
    }
    setToken(token) {
        this.requestConfig.header["shop-token"] = token;
    }
    /**
     * 请求数据
     * @param params 
     */
    async request(params: request.Param, loading = true): Promise<ApiResponse> {
        params.header = { ...this.requestConfig.header, ...params.header }
        params.data = this.compatibleData({ ...params.data })
        params.url = this.compatibleUrl(this.address, params.url);
        const res = await Taro.request(params);
        if (res && res.statusCode == 200) {
            return res.data;
        } else {
            if (res.statusCode >= 500) {
                Taro.showToast({ title: "连接超时", icon: "none", duration: 4000 })
            }
            return {
                isSuccess: false
            } as any
        }
    }
    /**
     * 上传文件
     * @param params 
     */
    async uploadFile(params: uploadFile.Param) {
        Taro.showLoading({ title: "上传中", mask: true })
        params.header = {
            "Content-Type": "multipart/form-data"
            , ...params.header
        }
        params.formData = this.compatibleData({ ...params.formData })
        params.url = this.compatibleUrl(this.address, params.url);
        const uploadTask = await Taro.uploadFile(params)
        Taro.hideLoading()
        return uploadTask;
    }
    /**
     * url 兼容处理 
     * @param address 前缀
     * @param url url
     * @param endStr 结尾，参数等
     */
    compatibleUrl(address: string, url: string, endStr?: string) {
        endStr = endStr || ''
        if (/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(url)) {
            return `${url}${endStr}`;
        }
        else {
            // address  / 结尾  url / 开头
            const isAddressWith = endsWith(address, "/")
            const isUrlWith = startsWith(url, "/")
            // debugger
            if (isAddressWith) {
                if (isUrlWith) {
                    url = trimStart(url, "/")
                }
            } else {
                if (isUrlWith) {

                } else {
                    url = "/" + url;
                }
            }
        }
        return `${address}${url}${endStr}`
    }
    /**
     * 删除 空属性
     * @param data 
     */
    compatibleData(data) {
        Object.keys(data).map(x => {
            const val = data[x]
            if (val == null || val == undefined) {
                delete data[x]
            }
        })
        return data
    }
}
export const WXRequest = new WXRequestClass();