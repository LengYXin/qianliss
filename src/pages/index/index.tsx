import { View } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { CommodityStore } from '../../store';
import './index.less';
import SearchBar from './searchBar';
import Tabs from './tabs';
import Items from './items';
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '千里首铺',
    // 下拉刷新
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark"
  }
  // 下拉刷新
  async onPullDownRefresh() {
    CommodityStore.onGetSkuCategoryRoot();
    await CommodityStore.Paging.getPagingData(true)
    Taro.stopPullDownRefresh()
  }
  // 滚动加载
  onReachBottom() {
    CommodityStore.Paging.getPagingData()
  }
  componentWillMount() {
   
  }
  componentWillReact() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  render() {
    return (
      <View className='index'>
        <View className="title">
          <SearchBar />
          <Tabs />
        </View>
        <Items />
      </View>
    )
  }
}

export default Index
