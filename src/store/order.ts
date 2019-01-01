import Taro from "@tarojs/taro";
import { action, observable } from "mobx";
import { WXRequest } from "./native/request";
import Paging from './paging';
class Order {
    constructor() {

    }
    typeList = [{ title: '待支付', id: 190100 }, { title: '待发货', id: 190101 }, { title: '待收货', id: 190102 }, { title: '已完成', id: 190103 }]
    // 类型选择索引
    @observable current = 0;
    // 首页分页数据
    Paging = new Paging({
        url: "/Api/cgi/Query/SaleBill",
        data: {
            status: 190100
        }
    })
    /**
    * 查询订单
    * 待支付 190100
       待发货 190101
       待收货 190102
       已完成 190103
    */
    @action.bound
    onSetCurrent(current) {
        this.current = current;
        Taro.pageScrollTo({
            scrollTop: 0,
            duration: 0
        })
        this.Paging.onReset({ status: this.typeList[current].id });
        this.Paging.getPagingData(true);
    }
    /**
    * 创建订单
    * @param data 
    */
    async onCreateSaleBill(data) {
        const res = await WXRequest.request({
            url: "/Api/cgi/Create/SaleBill", data, method: "POST"
        });
        if (res.isSuccess) {
            await this.onRequestPayment({
                nonceStr: res.data.payNonceStr,
                package: 'prepay_id=' + res.data.payPackage,
                paySign: res.data.paySign,
                timeStamp: res.data.payTimeStamp + '',
            })
        }
    }
    /**
    * 支付
    * @param id 
    */
    async onPayByWeixinBegin(id) {
        Taro.showLoading({ title: "加载中", mask: true })
        const res = await WXRequest.request({ url: "/Api/cgi/Pay/ByWeixinBegin", data: { billid: id }, method: "POST" });
        Taro.hideLoading()
        if (res.isSuccess) {
            const yes = await this.onRequestPayment(
                {
                    nonceStr: res.data.nonceStr,
                    package: 'prepay_id=' + res.data.package,
                    paySign: res.data.sign,
                    timeStamp: res.data.timeStamp + '',
                }
            )
            if (yes) {
                this.Paging.onReset({ status: this.typeList[this.current].id });
                this.Paging.getPagingData(true);
            }
        } else {
            Taro.showToast({ title: res.message, icon: "none" })
        }

    }
    /**
     * 确认收货
     * @param id 
     */
    async onReceiveSaleBill(id) {
        Taro.showLoading({ title: "加载中", mask: true })
        const res = await WXRequest.request({ url: "/Api/cgi/Receive/SaleBill", data: { id }, method: "POST" });
        Taro.hideLoading()
        if (res.isSuccess) {
            Taro.showToast({ title: '已确认收货' })
            this.Paging.onReset({ status: this.typeList[this.current].id });
            this.Paging.getPagingData(true);
        } else {
            Taro.showToast({ title: res.message, icon: "none" })
        }
    }
    /**
        * 支付
        * @param data 
        */
    async onRequestPayment(data) {
        try {
            await Taro.requestPayment(
                {
                    signType: "MD5",
                    ...data
                    // nonceStr: res.payNonceStr,
                    // package: 'prepay_id=' + res.payPackage,
                    // paySign: res.paySign,
                    // timeStamp: res.payTimeStamp + '',
                }
            )
            Taro.showToast({
                title: "支付成功",
                icon: "success",
            })
            return true
        } catch (error) {
            Taro.showToast({
                title: "支付失败",
                icon: "success",
            })
            return false
        }

    }
}
export const OrderStore = new Order();