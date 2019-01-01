import { observable, action, decorate, runInAction } from 'mobx'
import { WXRequest } from './native/request';
import { request } from '@tarojs/taro';
import Taro from '@tarojs/taro';

/**
 * 分页函数
 */
export default class ServerClass {
    constructor(
        public params: request.Param
    ) {

        const data = params.data
        this.params.data = {
            page: 1,
            rows: 10,
            ...data
        }
    }
    /**
      * 首次加载
      */
    @observable firstLoading = true;
    // 加载
    @observable PagingLoading = false;
    // 刷新
    @observable PagingRefreshing = false;
    // 数据
    @observable PagingData: any[] = [];
    @observable endData = false;
    /**
     * 获取数据
     * @param refresh 刷新数据
     */
    @action.bound
    async getPagingData(refresh = false, showLoading = true) {
        // console.time("getPagingData");
        console.log( this.PagingLoading, this.PagingRefreshing);
        if (this.PagingLoading || this.PagingRefreshing) {
            return
        }
        let PagingData = [], startTime = new Date().getTime();
        // 刷新 or 第一次请求
        if (refresh) {
            if (showLoading) {
                Taro.showLoading({ title: "加载中", mask: true })
            }
            // if (!this.firstLoading) {
                this.PagingRefreshing = true;
            // }
            this.params.data.page = 1;
            this.endData = false;
        } else {
            !this.PagingLoading && (this.PagingLoading = true);
            if (this.endData) {
                this.PagingLoading = false;
                this.PagingRefreshing = false;
                return console.log("无更多数据");
            }
        }
        const res = await WXRequest.request(this.params)
        if (res.isSuccess) {
            PagingData = res.data.items;
        }
        const diff = new Date().getTime() - startTime;
        // 等菊花转完
        if (diff < 600) {
            await new Promise((resole, reject) => {
                setTimeout(() => {
                    this.runInAction(refresh, PagingData)
                    resole();
                }, 600 - diff);
            })
        } else {
            this.runInAction(refresh, PagingData)
        }
    }
    /**
     * 设置数据状态
     * @param refresh 
     * @param PagingData 
     */
    runInAction(refresh, PagingData) {
        // console.timeEnd("getPagingData");
        runInAction(() => {
            this.PagingLoading = false;
            this.PagingRefreshing = false;
            this.firstLoading = false;
            if (PagingData.length >= this.params.data.rows) {
                this.params.data.page++;
            } else {
                this.endData = true;
            }
            // 刷新 or 第一次请求
            if (refresh) {
                this.PagingData = PagingData;
                Taro.hideLoading()
            } else {
                this.PagingData = [...this.PagingData, ...PagingData];
            }
        });
    }
    /**
     * 重置参数
     * @param param 
     */
    @action.bound
    onReset(param?) {
        this.firstLoading = true;
        // this.PagingData = [];
        this.params.data = {
            ...this.params.data,
            page: 1,
            rows: 10,
            ...param
        }
    }
}

