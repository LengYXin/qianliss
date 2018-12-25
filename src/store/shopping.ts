import Taro from "@tarojs/taro";
import { action, observable, runInAction, computed } from "mobx";
import { WXRequest } from "./native/request";
import find from 'lodash/find';
import isArray from 'lodash/isArray';

class Shopping {
    constructor() {
        const dataList = Taro.getStorageSync(this.storaKey)
        if (isArray(dataList)) {
            this.dataList = dataList;
        }
    }
    storaKey = "Shopping_DataList"
    // 购物车商品
    @observable dataList: any[] = [];
    @observable couponList: any[] = [];
    @observable couponShow = false;
    @observable couponSelect = "";
    // 商品数量
    @computed get total() {
        return this.dataList.length;
    }
    // 总价
    @computed get totalPrice() {
        try {
            let price = 0;
            this.dataList.map(x => {
                if (x.select) {
                    price += x.price * x.count
                }
            })
            return parseFloat(price.toString()).toFixed(2);
        } catch (error) {
            this.onUpdateDataList([]);
        }
    }
    // 全选状态
    @computed get selectAll() {
        try {
            return this.dataList.length && this.dataList.every(x => x.select)
        } catch (error) {
            this.onUpdateDataList([]);
        }
    }
    @action.bound
    onUpdateDataList(dataList) {
        this.dataList = dataList;
        Taro.setStorageSync(this.storaKey, [...this.dataList]);
    }
    // 加入购物车
    @action.bound
    onSetShopping(data) {
        const comm = find(this.dataList, ['id', data.id])
        if (comm) {
            comm.number += data.number;
        } else {
            this.dataList.push(data);
        }
        this.onUpdateDataList(this.dataList.slice());
        Taro.showToast({ title: "已加入购物车", icon: "none" })
    }
    /** 修改价格 */
    @action.bound
    onUpdateCount(index, count) {
        this.dataList[index].count = count;
        this.onUpdateDataList(this.dataList.slice());
    }
    /** 修改选择状态 */
    @action.bound
    onUpdateSelect(index) {
        this.dataList[index].select = !this.dataList[index].select;
        this.onUpdateDataList(this.dataList.slice());
    }
    /** 全选 */
    @action.bound
    onUpdateSelectAll(select) {
        this.onUpdateDataList(this.dataList.map(x => {
            x.select = select;
            return x;
        }));
    }
    /** 删除 */
    onDelete(index) {
        const dataList = [...this.dataList];
        dataList.splice(index, 1);
        this.onUpdateDataList(dataList);
    }
    /** 结算 */
    async onSettlement(coupon = this.couponSelect) {
        if (coupon == "" && !this.couponShow) {
            const isCoupon = await this.onGetCoupon();
            console.log(isCoupon);
        } else {
        }
    }
    /** 优惠卷 */
    async onGetCoupon() {
        const { isSuccess, data } = await WXRequest.request({ url: "/Api/cgi/List/Coupon" });
        if (isSuccess && data.items.length) {
            runInAction(() => {
                this.couponList = data.items;
                this.couponShow = true;
                Taro.hideTabBar()
            })
            return true;
        }
        return false
    }
}
export const ShoppingStore = new Shopping();