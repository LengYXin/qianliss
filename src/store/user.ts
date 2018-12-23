import Taro, { getUserInfo } from "@tarojs/taro";
import { observable, runInAction } from "mobx";
import { WXRequest } from "./native/request";

class User {
    // 授权
    @observable unAuthorized = false;
    // 登陆
    @observable isLogin = false;
    // 用户信息
    @observable userInfo = {
        isRegistered: false,
        token: ""
    };
    // 微信用户信息
    @observable userInfoWX = {};
    /**
     * 登陆
     * @param code 微信临时code 
     */
    async onLogin() {
        const { code } = await Taro.login();
        const res = await WXRequest.request({
            url: "/Api/cgi/Login/ByWeixin",
            method: "POST",
            data: {
                code
            }
        })
        if (res.isSuccess) {
            runInAction(() => {
                this.userInfo = res.data;
            })
            WXRequest.setToken(res.data.token)
        }
    }
    /**
     * 微信用户信息
     * @param params 
     */
    async  onGetUserInfo(params?: getUserInfo.Param) {
        if (!this.isLogin) {
            try {
                const res = await Taro.getUserInfo(params)
                runInAction(() => {
                    this.userInfoWX = JSON.parse(res.rawData)
                    this.unAuthorized = false;
                })
            } catch (error) {
                console.error(error);
            }
        }
    }
}
export const UserStore = new User();