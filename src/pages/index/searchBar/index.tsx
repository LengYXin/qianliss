import { View } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { CommodityStore } from '../../../store';
import { AtSearchBar } from 'taro-ui'
import './index.less';
@observer
class Index extends Component {
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
    CommodityStore.onGetSkuCategoryRoot();
    CommodityStore.Paging.getPagingData(true)
  }
  componentWillReact() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  onSearchBar() { }
  render() {
    return (
      <View className='index'>
        <AtSearchBar value={""} onChange={this.onSearchBar.bind(this)} />
      </View>
    )
  }
}

export default Index
