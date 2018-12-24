import { observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { AtTabs } from 'taro-ui';
import { CommodityStore } from '../../../store';
import './index.less';
import { View } from '@tarojs/components';
require("taro-ui/dist/weapp/css/index.css")
@observer
class Index extends Component {
  componentWillReact() {
  }
  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  onClick(current) {
    CommodityStore.onSetCurrent(current);
  }
  render() {
    const tabList = [...CommodityStore.typeList]
    const current = CommodityStore.current;
    return (
      <AtTabs
        className="tabs"
        current={current}
        scroll
        swipeable={false}
        tabList={tabList}
        onClick={this.onClick.bind(this)}>
      </AtTabs>
      // <View className="test">
      //   {tabList.map(x => <View>{x.title}</View>)}
      // </View>
    )
  }
}

export default Index
