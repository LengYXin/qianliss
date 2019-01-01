import Taro from "@tarojs/taro";
import { action, observable, runInAction } from "mobx";
import { WXRequest } from "./native/request";
import find from 'lodash/find';
import Paging from './paging';
class Commodity {
    // 搜索字段
    @observable searchBar = "";
    // 已经重置搜索
    searchBarReset = "";
    // 类型选择索引
    @observable current = 0;
    // 类型列表
    @observable typeList: any[] = [

    ];
    // 首页分页数据
    Paging = new Paging({
        url: "/Api/cgi/Query/Sku",
        data: {

        }
    })
    @observable details: any = {};
    onGetTabText(id) {
        const comm = find(this.typeList, ['id', id])
        if (comm) {
            return comm.title;
        }
        return ""
    }
    /**
     * 获取分类
     */
    async onGetSkuCategoryRoot() {
        const { isSuccess, data } = await WXRequest.request({ url: "/Api/cgi/List/SkuCategoryRoot" }, false);
        if (isSuccess) {
            runInAction(() => {
                this.typeList = [{ title: '全部', id: "" }, ...data.items.map(x => {
                    return { title: x.text, ...x }
                })]
            })
        }
    }
    @action.bound
    async onSetSearchBar(text) {
        this.searchBar = text;
        if (text === "" && this.searchBarReset !== "") {
            this.onSearch()
        }
    }
    /**
     * 搜索
     */
    async onSearch() {
        // if (this.searchBar != "") {
        this.searchBarReset = this.searchBar;
        this.Paging.onReset({ filter: this.searchBar });
        this.Paging.getPagingData(true);
        // } else {
        //     Taro.showToast({ title: "请输入关键字", icon: "none" })
        // }
    }
    @action.bound
    onSetCurrent(current) {
        this.current = current;
        Taro.pageScrollTo({
            scrollTop: 0,
            duration: 0
        })
        this.Paging.onReset({ categoryId: this.typeList[current].id });
        this.Paging.getPagingData(true);
    }
    /**
     * 获取详情
     * @param id 
     */
    async onGetSkuDetail(id) {
        const { isSuccess, data } = await WXRequest.request({ url: "/Api/cgi/Get/SkuDetail", data: { id } });
        if (isSuccess) {
            this.onSetDatails(data)
        }
        return true;
    }
    @action.bound
    onSetDatails(dtl) {
        this.details = dtl;
    }
}
export const CommodityStore = new Commodity();