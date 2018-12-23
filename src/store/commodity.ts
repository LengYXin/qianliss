import { observable, runInAction } from "mobx";
import { WXRequest } from "./native/request";
import Paging from './paging';
class Commodity {
    @observable typeList = [];
    Paging = new Paging({
        url: "/Api/cgi/Query/Sku",
        data: {

        }
    })
    /**
     * 获取分类
     */
    async onGetSkuCategoryRoot() {
        const { isSuccess, data } = await WXRequest.request({ url: "/Api/cgi/List/SkuCategoryRoot" }, false);
        if (isSuccess) {
            runInAction(() => {
                this.typeList = data.items.map(x => {
                    return { title: x.text, ...x }
                });
            })
        }
    }

}
export const CommodityStore = new Commodity();