import Taro from "@tarojs/taro";
import { action, observable, runInAction, computed } from "mobx";
import { WXRequest } from "./native/request";
import find from 'lodash/find';
import isArray from 'lodash/isArray';
import { UserStore } from './user';
import { OrderStore } from './order';
class Shopping {
    constructor() {
        const dataList = Taro.getStorageSync(this.storaKey)
        if (isArray(dataList)) {
            this.onUpdateDataList(dataList)
        }
    }
    storaKey = "Shopping_DataList"
    // 购物车商品
    @observable dataList: any[] = [];
    @observable couponList: any[] = [];
    @observable couponShow = false;
    @observable couponSelect = {
        amount: 0,
        no: ''
    };
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
            price -= this.couponSelect.amount;
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
    /** 更新列表 */
    @action.bound
    onUpdateDataList(dataList) {
        this.dataList = dataList;
        Taro.setStorageSync(this.storaKey, [...this.dataList]);
    }
    /** 加入购物车 */
    @action.bound
    onSetShopping(data) {
        if (data.stock && data.stock.count > 0) {
            const comm = find(this.dataList, ['id', data.id])
            if (comm) {
                comm.number += data.number;
            } else {
                this.dataList.push({ count: 1, select: true, ...data });
            }
            this.onUpdateDataList(this.dataList.slice());
            Taro.showToast({ title: "已加入购物车", icon: "none" })
        } else {
            Taro.showToast({ title: "库存不足", icon: "none" })
        }
    }
    /** 修改价格 */
    @action.bound
    onUpdateCount(index, count) {
        const data = this.dataList[index];
        if (data.stock && data.stock.count > count) {
            this.dataList[index].count = count;
            this.onUpdateDataList(this.dataList.slice());
        } else {
            Taro.showToast({ title: "库存不足", icon: "none" })
        }
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
    async onSettlement(coupon = true) {
        Taro.showLoading({ title: "加载中", mask: true })
        const orderData = {
            contactMan: UserStore.defaultAddress.contactMan,
            contactPhone: UserStore.defaultAddress.contactPhone,
            address: UserStore.defaultAddress.fullValue,
            skus: this.dataList.filter(x => x.select).map(x => {
                return {
                    id: x.id,
                    count: x.count
                }
            })
        }
        // 查询优惠卷
        if (coupon) {
            const isCoupon = await this.onGetCoupon();
            if (isCoupon) {
            } else {
                // 无优惠卷结算
                await this.onCreateSaleBill(orderData);
            }
        } else {
            this.onCreateSaleBill(orderData)
        }
        Taro.hideLoading();
    }
    async onCreateSaleBill(orderData) {
        // return console.log({
        //     coupons: [{ ...this.couponSelect }],
        //     ...orderData
        // });
        orderData = {
            coupons: [{ ...this.couponSelect }],
            ...orderData
        }
        this.onCouponShow(false)
        this.onUpdateDataList(this.dataList.filter(x => !x.select));
        // 直接结算
        await OrderStore.onCreateSaleBill(orderData);
    }
    /** 优惠卷 */
    @action.bound
    async onGetCoupon() {
        this.couponList = [];
        const { isSuccess, data } = await WXRequest.request({ url: "/Api/cgi/List/Coupon" });
        if (isSuccess && data.items.length > 0) {
            runInAction(() => {
                this.couponList = data.items.map(x => {
                    return {
                        ...x,
                        amountStr: x.amount.toFixed(2)
                    }
                });
                this.onCouponShow()
            })
            return true;
        }
        return false
    }
    /** 选择优惠卷 */
    @action.bound
    onCouponSelect(data) {
        if (this.couponSelect.no == data.no) {
            return this.couponSelect = {
                amount: 0,
                no: ''
            }
        }
        this.couponSelect = data;
    }
    /** 显示优惠卷选择 */
    @action.bound
    onCouponShow(show = !this.couponShow) {
        this.couponShow = show;
        if (show) {
            // Taro.hideTabBar()
        } else {
            // Taro.showTabBar()
            this.couponSelect = {
                amount: 0,
                no: ''
            }
        }
    }
}
export const ShoppingStore = new Shopping();