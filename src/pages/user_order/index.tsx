import { View } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import Loading from '../../components/loading';
import { OrderStore } from '../../store';
import './index.less';
import Item from './item';
import Tabs from './tabs';
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
    await OrderStore.Paging.getPagingData(true)
    Taro.stopPullDownRefresh()
  }
  // 滚动加载
  onReachBottom() {
    OrderStore.Paging.getPagingData()
  }
  componentWillMount() {
  }
  componentWillReact() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    OrderStore.Paging.getPagingData(true)
  }

  componentDidHide() { }
  onSearchBar() { }
  render() {
    const PagingData = [...OrderStore.Paging.PagingData];
    const loadingVis = OrderStore.Paging.PagingLoading;
    const dataNull = !(OrderStore.Paging.PagingLoading || OrderStore.Paging.PagingRefreshing) && PagingData.length <= 0;
    return (
      <View className='user_order'>
        <View className='title'>
          <Tabs />
        </View>
        {dataNull ? <View className="data-null">没有订单</View> : <View />}
        {PagingData.map(x => {
          return <Item key={x.id} data={x} />
        })}
        <Loading visible={loadingVis} />
      </View >
    )
  }
}

export default Index
