import Taro, { getUserInfo } from "@tarojs/taro";
import { observable, runInAction, computed, action } from "mobx";
import { WXRequest } from "./native/request";

class User {
    // 授权
    @observable authorized = false;
    // 登陆
    @observable isLogin = false;
    // 用户信息
    @observable userInfo = {
        isRegistered: false,
        token: ""
    };
    // 收货地址
    @observable address: any[] = [];
    // 微信用户信息
    @observable userInfoWX = {
        nickName: "",
        avatarUrl: ""
    };
    // 收货地址
    @observable __defaultAddress: any = null;
    @computed get defaultAddress() {
        if (this.__defaultAddress) {
            return this.__defaultAddress
        }
        if (this.address.length > 0) {
            let address = this.address.find(x => x.isDefault) || this.address[0]
            return address;
        }
        return {}
    }
    @action.bound
    onSetDefaultAddress(data) {
        this.__defaultAddress = { ...data };
    }
    /**
     * 登陆
     * @param code 微信临时code 
     */
    async onLogin() {
        if (!this.authorized) {
            return
        }
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
                this.isLogin = true;
                this.userInfo = res.data;
            })
            WXRequest.setToken(res.data.token)
            this.onGetAddress()
            // 未注册
            if (!res.data.isRegistered) {
                this.onRegistered()
            }
        }
    }
    /**
     * 微信用户信息
     * @param params 
     */
    async  onGetUserInfo(params?: getUserInfo.Param, loading = false) {
        try {
            if (loading) {
                Taro.showLoading({ title: "加载中", mask: true })
            }
            const res = await Taro.getUserInfo(params)
            runInAction(() => {
                this.userInfoWX = JSON.parse(res.rawData)
                this.authorized = true;
                // this.isLogin = true;
            })
            await this.onLogin();
            Taro.hideLoading()
        } catch (error) {
            Taro.hideLoading()
            console.error(error);
        }
    }
    /**
     * 注册
     * @param parmas 
     */
    async onRegistered() {
        const res = await WXRequest.request({
            url: "/Api/cgi/Update/ProfileByWeixin",
            data: {
                name: this.userInfoWX.nickName,
                avatar: this.userInfoWX.avatarUrl,
                // phone: '',
            }, method: "POST"
        }, false);
        return res;
    }
    /**
     * 收货地址
     */
    async onGetAddress() {
        const res = await WXRequest.request({ url: "/Api/cgi/List/DeliveryAddress" }, false);
        if (res.isSuccess) {
            runInAction(() => {
                this.address = res.data.items;
            })
        }
    }
    /**
     * 创建收货地址
     * @param data 
     */
    async onCreateAddress(data) {
        Taro.showLoading({ title: "加载中" })
        const res = await WXRequest.request({
            url: "/Api/cgi/Create/DeliveryAddress",
            data: {
                ...data,
                isDefault: this.address.length == 0
            }, method: "POST"
        }, false);
        Taro.hideLoading();
        if (res.isSuccess) {
            Taro.showToast({ title: "创建成功", icon: "none" });
            Taro.navigateBack();
            // this.onGetAddress();
        } else {
            Taro.showToast({ title: res.message, icon: "none" });
        }
    }
    /**
     * 修改地址
     * @param data 
     */
    async onUpdateAddress(data) {
        Taro.showLoading({ title: "加载中" })
        const res = await WXRequest.request({
            url: "/Api/cgi/Update/DeliveryAddress",
            data: {
                ...data,
                // isDefault: this.address.length == 0
            }, method: "POST"
        }, false);
        Taro.hideLoading();
        if (res.isSuccess) {

            if (this.__defaultAddress && data.id == this.__defaultAddress.id) {
                this.onSetDefaultAddress(data)
            }
            Taro.showToast({ title: "创建成功", icon: "none" });
            Taro.navigateBack();
            // this.onGetAddress();
        } else {
            Taro.showToast({ title: res.message, icon: "none" });
        }
    }
}
export const UserStore = new User();